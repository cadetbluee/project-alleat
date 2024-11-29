package com.example.AllEat.handler;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class FileHandler {
    //    private static final String BASE_PATH = "/opt/openvidu/recordings/live/";
    //    private static final String RETURN_PATH = "https://localhost:8080/AllEat/users/info/";
    public String parseFileInfo(MultipartFile multipartFile) throws Exception {
        // 전달되어 온 파일이 존재할 경우
        System.out.println(multipartFile);
        System.out.println(multipartFile.isEmpty());
        System.out.println(multipartFile != null);
        if (!multipartFile.isEmpty()) {
            System.out.println("파일 이름: " + multipartFile.getOriginalFilename());
            System.out.println("파일 크기: " + multipartFile.getSize());
            System.out.println("Content-Type: " + multipartFile.getContentType());

            String originalFileExtension = null;
            String path = null;
            String absolutePath = new File("").getAbsolutePath() + File.separator + File.separator;

            // 파일명을 업로드한 날짜로 변환하여 저장
            LocalDateTime now = LocalDateTime.now();
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            String currentDate = now.format(dateTimeFormatter);

            // 파일을 저장할 세부 경로 지정
            path = "images" + File.separator + currentDate;
            File file = new File(path);


            // 디렉토리가 존재하지 않을 경우 생성
            if (!file.exists()) {
                boolean wasSuccessful = file.mkdirs();
                if (!wasSuccessful) {
                    System.out.println("file: was not successful");
                    return null;
                }
            }

            // 파일의 확장자 추출
            String contentType = multipartFile.getContentType();
            System.out.println("file contentType: " + contentType);
            if (contentType.contains("image/jpeg")) {
                originalFileExtension = ".jpg";
            } else if (contentType.contains("image/png")) {
                originalFileExtension = ".png";
            } else {
                // 처리할 수 없는 파일 형식인 경우
                throw new Exception("지원하지 않는 파일 형식입니다.");
            }

            // 파일명 중복 피하고자 나노초까지 얻어와 지정
            String newFileName = System.nanoTime() + originalFileExtension;

            // 업로드 한 파일 데이터를 지정한 파일에 저장
            file = new File(absolutePath + path + File.separator + newFileName);
            multipartFile.transferTo(file);

            // 파일 권한 설정(쓰기, 읽기)
            file.setWritable(true);
            file.setReadable(true);

            return path + File.separator + newFileName;
        } else {
            // 파일이 없을 경우 null 반환
            return null;
        }
    }
}
