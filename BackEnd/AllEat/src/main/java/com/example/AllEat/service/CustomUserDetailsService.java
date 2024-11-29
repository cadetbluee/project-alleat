package com.example.AllEat.service;

import com.example.AllEat.dto.user.*;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsService extends DefaultOAuth2UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 폼 로그인을 처리하는 메서드
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity userData = userRepository.findByEmail(email);
        if (userData == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(userData);
    }

    // 소셜 로그인을 처리하는 메서드
    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;

        if (registrationId.equals("naver")) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
            System.out.println("naver : " + oAuth2Response);
        } else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
            System.out.println("구글이다");
        } else if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        } else {
            throw new OAuth2AuthenticationException("Unknown registration id");
        }

        UserEntity existData = userRepository.findByEmail(oAuth2Response.getEmail());

        if (existData == null) {
            UserEntity user = UserEntity.builder()
                    .email(oAuth2Response.getEmail())
                    .userName(oAuth2Response.getName())
                    .profileUrl(oAuth2Response.getProfilePicture())
                    .role("ROLE_USER")
                    .build();
            userRepository.save(user);
            return new CustomOAuth2User(user);
        } else {
            existData.updateProfile(oAuth2Response.getEmail(), oAuth2Response.getName(), oAuth2Response.getProfilePicture());
            userRepository.save(existData);
            System.out.println("google login succ");
            return new CustomOAuth2User(existData);
        }
    }
}
