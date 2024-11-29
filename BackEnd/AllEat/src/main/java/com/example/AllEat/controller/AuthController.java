package com.example.AllEat.controller;

import com.example.AllEat.dto.user.*;
import com.example.AllEat.entity.UserEntity;
import com.example.AllEat.handler.FileHandler;
import com.example.AllEat.jwt.JwtUtil;

import com.example.AllEat.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/AllEat/users")
@Slf4j
public class AuthController {

    private final UserService userService;
    private final FileHandler fileHandler;

    private JwtUtil jwtUtil;

    @Autowired
    public AuthController(UserService userService, FileHandler fileHandler) {
        this.userService = userService;
        this.fileHandler = fileHandler;
    }

    // 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> registerUser(@Validated @RequestBody UserJoinDTO userJoinDTO) {
        try {
            userService.registerUser(userJoinDTO);
            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 유저 정보 조회
    @GetMapping("/info")
    public ResponseEntity<?> getUser(HttpServletRequest request) {
        try {
            UserEntity userEntity = userService.findByRequest(request);
            UserResponseDTO findUserResponseDTO = userService.getUserDTO(userEntity);
            return new ResponseEntity<>(findUserResponseDTO, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 회원 탈퇴
    @DeleteMapping
    public ResponseEntity<?> deleteUser(HttpServletRequest request) {
        try {
            // UserService에서 JWT 토큰을 사용하여 사용자를 삭제
            userService.deleteUserInfo(request);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/social-login")
    public ResponseEntity<?> checkUser(@Validated @RequestBody UserEmailRequestDTO userEmailRequestDTO) {
        Boolean isUse = userService.getUserEmail(userEmailRequestDTO.getEmail());
        EmailCheckDTO emailCheckDTO = new EmailCheckDTO();
        emailCheckDTO.setNew(!isUse);
        return ResponseEntity.status(HttpStatus.OK).body(emailCheckDTO);
    }

//    @Operation(summary = "회원 정보 수정", description = "회원 정보를 수정할 때 사용합니다. ")
    @PutMapping(value = "/info", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUserInfo(@RequestPart(value = "photoFile", required = false) MultipartFile photoFile,
                                            @RequestPart("data") UpdateRequestDTO updateRequest, HttpServletRequest request) {
        try {
            UserEntity getUser = userService.findByRequest(request);
            if (getUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            String profilePicture = null;
            try {
                if (photoFile != null && !photoFile.isEmpty()) {
                    System.out.println("파일 들어가요");
                    System.out.println(photoFile.getContentType());
                    profilePicture = fileHandler.parseFileInfo(photoFile);
                }
            }
            catch (Exception e) {
                log.error("파일 처리 중 오류 발생: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("파일 처리 중 오류가 발생했습니다: " + e.getMessage());
            }
            Boolean same = userService.comparePassword(updateRequest.getPassword1(), updateRequest.getPassword2());
            if (same) {
                UserEntity updateUser = userService.updateUserInfo(getUser.getEmail(), updateRequest, profilePicture);
                UserResponseDTO updateUserResponseDTO = userService.getUserDTO(updateUser);
                return ResponseEntity.status(HttpStatus.OK).body(updateUserResponseDTO);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
