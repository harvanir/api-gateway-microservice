cd eureka||exit
./mvnw clean install -Dmaven.test.skip=true
docker build -t eureka .

cd ../cloud-gateway||exit
./mvnw clean install -Dmaven.test.skip=true
docker build -t spring-cloud-gateway .

cd ../webflux||exit
./mvnw clean install -Dmaven.test.skip=true
docker build -t webflux .

cd ../webmvc||exit
./mvnw clean install -Dmaven.test.skip=true
docker build -t webmvc .

cd ../go||exit
docker build -t go .

cd ..
docker-compose -f docker-compose.yaml --compatibility up