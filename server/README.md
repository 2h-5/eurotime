# react任务管理系统

## 项目说明
> 本任务管理系统使用Node.js和Express框架构建，前端采用React进行开发。系统支持用户的注册、登录、创建任务、编辑任务等功能，并利用MongoDB数据库存储数据。
>

## 技术栈

- **后端**: Node.js, Express
- **数据库**: MongoDB
- **前端**: React, Ant Design
- **状态管理**: React Hooks
- **路由管理**: React Router

## 功能实现

### 用户注册与登录

- 使用MongoDB存储用户信息，包括用户名、邮箱和加密后的密码。
- 用户注册时，密码通过bcrypt进行加密后存储。
- 用户登录时，通过比对加密密码实现身份验证。
- 登录状态保持通过session和cookie实现，前端通过存储token在localStorage或sessionStorage中实现。

### 任务管理

- 用户可以创建、查看、编辑和删除任务。
- 任务信息包括任务详情、截止时间和完成状态等。
- 利用Ant Design的表单组件进行任务信息的输入和验证。
- 任务数据存储在MongoDB中，通过Express框架的API进行操作。

## 数据结构

### 用户

```javascript
{
  username: String,
  email: String,
  password: String // 加密存储
}
```

### 任务

```
{
  details: String,
  deadline: Date,
  completed: Boolean
}
```

## 安全性

- 密码在数据库中加密存储，确保用户信息的安全。
- 使用token进行身份验证，提高系统的安全性。

## 登录状态保持

- 登录成功后，前端将token存储在localStorage或sessionStorage中。
- 每次发送请求时，将token放在HTTP请求的Authorization头部发送给服务器进行身份验证。
- 检查用户的登录状态，如果未登录则重定向到登录页面。

## 项目运行

1. 启动后端服务器（后端会首先占用3000端口）

   ```
   cd backend
   npm install
   npm start
   ```

2. 启动前端项目（前端默认修改端口为3001）

   ```
   cd frontend
   npm install
   npm start
   ```

## 结语

本项目实现了一个基本的任务管理系统，包括用户注册、登录、任务的增删改查等功能，通过MongoDB进行数据存储，利用React和Ant Design构建前端界面，实现了一个简洁美观且功能完备的管理系统。
