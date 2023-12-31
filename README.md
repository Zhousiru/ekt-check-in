# EKT Check-in

CUIT 第二课堂助手网站

## 引言

### 提示

项目仅供交流学习，**不提供已部署上线的服务。**

此项目使用的方法并不是长久之计，在此提供一些其他的思路：

- 开发 APP，使用 WebView 应对 Web VPN 登录
- 开发 Tampermonkey 脚本 / 浏览器插件

### 理论基础

- 校内蜀天云服务器可以直通位于校园内网的 `ekty.cuit.edu.cn`，免去了繁琐的 Web VPN 登录流程
- 教务处账号 SSO 和第二课堂的登录没有做好对接，可以在第二课堂直接通过学号和弱口令 `123456` 登录

由以上两点可以通过随机学号登录第二课堂，获取活动 ID。同时签到码可以由活动 ID 生成（[WhereAreBugs/cuit_EKTY](https://github.com/WhereAreBugs/cuit_EKTY)），由此可实现全部活动的签到码生成和展示。

### 潜在问题

- SSO 对接漏洞被修复，必须教务处账号登陆
- 签到链接生成更加严格，导致所有类似程序失效
- 活动主办方线下人工签到，线上签到无效

## Features

- [x] 活动 ID 获取
- [x] 签到码生成
- [x] 通过输入学号，代为报名活动
- [x] 通过输入学号，代为签到（自定义日期）

## 第二课堂 API

`ekty.cuit.edu.cn` 目前需要在校园内网下访问

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/8280409-4f278737-3f48-4fe4-abb8-f10d6526c2fa?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D8280409-4f278737-3f48-4fe4-abb8-f10d6526c2fa%26entityType%3Dcollection%26workspaceId%3D9475b716-cc00-4b2c-a157-84c2982631a4)

## Monorepo 说明

- Worker：通过 WebSocket 连接到 Proxy，连通校园网内网
- Proxy：向 Worker 发送指令、接收返回数据，提供 API 接口
- Web：前端界面
