yarn build
docker build -t core.harbor.robotflow.ai/library/azure-kinect-frontend:latest .
docker push core.harbor.robotflow.ai/library/azure-kinect-frontend:latest