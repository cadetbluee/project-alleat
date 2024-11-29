package com.example.AllEat.controller;

import com.example.AllEat.jwt.JwtUtil;
import com.example.AllEat.repository.UserRepository;
import com.example.AllEat.service.ReissueService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/reissue")
@RequiredArgsConstructor
public class ReissueController {

    private final JwtUtil jwtUtil;
    private final ReissueService reissueService;
    private final UserRepository userRepository;

    @PostMapping("/update")
    public ResponseEntity<?> updateRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        //get refresh token
        String refreshToken = request.getHeader("Refresh");

        if (refreshToken == null || !refreshToken.startsWith("Bearer ")) {
            //response status code
            return new ResponseEntity<>("refresh token null", HttpStatus.BAD_REQUEST);
        }

        String token = refreshToken.substring(7);
        //expired check
        try {
            jwtUtil.isExpired(token);
        } catch (ExpiredJwtException e) {

            //response status code
            return new ResponseEntity<>("refresh token expired", HttpStatus.BAD_REQUEST);
        }

        // 토큰이 refresh인지 확인 (발급시 페이로드에 명시)
        String category = jwtUtil.getCategory(token);

        if (!category.equals("Refresh")) {

            //response status code
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        Boolean isExist = userRepository.existsByRefreshToken(refreshToken);
        if (!isExist) {
            //response body
            return new ResponseEntity<>("invalid refresh token", HttpStatus.BAD_REQUEST);
        }
        Map<String, Object> data = reissueService.updateRefreshEntity(token);

        response.setHeader("Authorization", "Bearer "  + (String) data.get("access"));
        response.setHeader("Refresh", "Bearer "  + (String) data.get("refresh"));
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value) {

        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}
