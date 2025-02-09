# 骑手配送 uni-app 项目

基于 uni-app 开发的外卖骑手配送管理系统，支持微信小程序、H5、App 等多端。

## 项目介绍

本项目是一个专门为外卖骑手开发的配送管理系统，提供订单接收、配送管理、路线规划等功能，帮助骑手提高配送效率。

### 主要功能

- 🚀 骑手登录注册
- 📦 订单管理与接单
- 🗺️ 智能路线规划
- 📍 实时定位追踪
- 📊 配送数据统计
- 💰 收入管理
- 🔔 订单提醒通知

## 技术栈

- 框架：uni-app
- UI组件：uni-ui
- 地图：腾讯地图SDK
- 状态管理：Vuex
- 开发工具：HBuilderX

## 安装运行

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 运行项目
```bash
# 运行到H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到App
npm run dev:app-plus
```

## 项目结构

```
├── pages                 # 页面文件夹
│   ├── login            # 登录页面
│   ├── orders           # 订单管理
│   └── map              # 地图导航
├── static               # 静态资源
├── store                # Vuex状态管理
├── utils                # 工具函数
└── components           # 公共组件
```

## 开发规范

- 组件命名：使用 PascalCase 命名法
- 文件命名：使用 kebab-case 命名法
- CSS 类名：使用 BEM 命名规范
- 代码格式：使用 ESLint + Prettier 规范代码

## 注意事项

1. 首次运行需要配置地图SDK密钥
2. 微信小程序需要配置对应的AppID
3. 正式环境部署需要配置对应的服务器域名

## 更新日志

### v1.0.0 (2024-03-xx)
- 🎉 项目初始化
- ✨ 完成基础登录功能
- 🗺️ 集成地图功能
- 📦 订单管理模块

## 联系方式

如有问题或建议，请提交 Issue 或联系开发团队。

## License

[MIT](LICENSE) 