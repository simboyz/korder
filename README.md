## 파봇-코스콤(STP-HUB) 주문 서버 샘플

사용 전
	- prefix_test.json 이라는 파일을 프로젝트 루트에 만들어 줍니다.
	- logs 라는 폴더를 루트에 생성합니다.

```
{
    "LOGIN_APIKEY": "로그인용API키",
    "QUERY_APIKEY": "조회용API키(위와같음)",
    "QUERY_SECRET": "조회용SECRET키",
    "SANDBOX": "sandbox-", //sandbox- 를 붙일 경우 테스트 서버, 제거하면 운용서버로 접속
    "COMID": "코스콤으로부터부여받은COMPID",
    "BUSINESS_ID": "코스콤과계약후부여받는BUSINESSID"
}
```

- - -
설치 전 요구사항 : node.js 6.x.x 이상의 버전
- - -

사용순서
```
>> git clone https://github.com/simboyz/k_order.git
>> cd k_order
>> npm install
>> npm start
```
- - -
http://localhost:3333 으로 이동하여, 계좌조회, 잔고조회, 주문조회 버튼을 각각 클릭하여 응답이 제대로 오는지 확인
- - -
사용기술 : node.js, socket.io, stomp
- - -
관련 문의 : hssim@bsmit.net
- - -
