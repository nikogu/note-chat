# 使用官方 Python 轻量级镜像
# https://hub.docker.com/_/python
FROM python:3.10-buster

# 将本地代码拷贝到容器内
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# 安装依赖
ENV CRYPTOGRAPHY_DONT_BUILD_RUST=1
RUN pip install setuptools_rust docker-compose
RUN pip install --upgrade pip
RUN pip --version
RUN pip install -r requirements.txt

# 启动 Web 服务
# 这里我们使用了 gunicorn 作为 Server，1 个 worker 和 8 个线程
# 如果您的容器实例拥有多个 CPU 核心，我们推荐您把线程数设置为与 CPU 核心数一致
CMD exec gunicorn --bind :80 --workers 1 --threads 8 --timeout 0 app:app