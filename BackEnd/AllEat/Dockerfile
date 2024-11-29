FROM openjdk:17-jdk
COPY build/libs/AllEat-0.0.1-SNAPSHOT.jar /alleat.jar
COPY foodinfo.csv .
COPY crawledData.csv .
COPY cafeData.csv .
ENTRYPOINT ["java", "-jar", "/alleat.jar"]

