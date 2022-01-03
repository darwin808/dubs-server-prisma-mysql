# endpoints:

## GET - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/posts

## POST - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/posts

## GET - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/thread

## POST - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/thread

## GET - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/user

## POST - https://dls4p0djl3.execute-api.us-west-2.amazonaws.com/dev/user

INSERT INTO thread (
title,
message,
user_id,
page_id,
media,
media_small

) SELECT
'some-title-' || round(random()*1000),
'some-message-' || round(random()*1000),
1,
2,
'https://picsum.photos/200',
'https://picsum.photos/200'

FROM generate_series(1,9000);

INSERT INTO user (
username,
ipAddress,

) SELECT
'some-username-' || round(random()*1000),
'some-ipAddress-' || round(random()*1000),

FROM generate_series(1,9000);
