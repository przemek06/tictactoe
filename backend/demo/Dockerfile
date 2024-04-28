FROM maven:3.8.3-openjdk-17
WORKDIR /app/
COPY pom.xml .
COPY ./src ./src
RUN mvn clean install -Dmaven.test.skip=true
ENTRYPOINT ["java", "-jar", "/app/target/demo-0.0.1-SNAPSHOT.jar"]