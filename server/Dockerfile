FROM node:10.15.3-alpine
ENV NODE_ENV production
RUN mkdir -p /home/landing_api_server
WORKDIR /home/landing_api_server
ADD . /home/landing_api_server
RUN yarn
EXPOSE 3010
CMD NODE_ENV=production yarn start