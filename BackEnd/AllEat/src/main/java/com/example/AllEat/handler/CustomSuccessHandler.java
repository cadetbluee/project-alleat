package com.example.AllEat.handler;

import com.example.AllEat.dto.user.CustomOAuth2User;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;
import java.util.Iterator;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String email = customUserDetails.getEmail();
        System.out.println("email: " + email);

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String AccessToken = jwtUtil.createJwt("access", email, role, 600000L);
        String RefreshToken = jwtUtil.createJwt("refresh", email, role, 86400000L);

        //Refresh 토큰 저장
        updateRefreshToken(email, RefreshToken, 86400000L);

        //응답 설정
        response.setHeader("Authorization", "Bearer " + AccessToken);
        response.setHeader("Refresh", "Bearer " + RefreshToken);
        response.setStatus(HttpStatus.OK.value());

        System.out.println("response: " + response.getHeader("Authorization"));
        System.out.println("response: " + response.getHeader("Refresh"));
        response.sendRedirect("http://localhost:8080/login");
    }
    @Transactional
    public void updateRefreshToken(String email, String refresh, Long expiredMs) {

        Timestamp expirationDate = new Timestamp(System.currentTimeMillis() + expiredMs);

        // 이메일로 사용자 조회
        UserEntity existingUserEntity = userRepository.findByEmail(email);
        existingUserEntity.updateRefreshToken(refresh, expirationDate);
        userRepository.save(existingUserEntity);
    }


//    @Override
//    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
//
//        response.setStatus(401);
//    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(60*60*60*60);
        //cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
