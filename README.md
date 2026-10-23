# 青账

React 网站 + React Native 手机应用，共享本地记账业务逻辑。视觉采用奶油白、墨绿和浅柠檬黄。

## 运行

需要 Node.js 22.12+、npm 10+。

```sh
npm install
npm test
npm run dev
```

网站由 Vite 启动，打开终端打印的地址。

```sh
npm run mobile
```

手机端使用 Expo SDK 55 / React Native 0.83 / React 19.2。使用匹配 SDK 55 的 Expo Go 或 development build 扫码；iOS 模拟器需要 macOS 和 Xcode。依赖更新后请在 `apps/mobile` 运行 `npx expo install --check`，按 Expo 的版本校验修正配套原生依赖。

## 目录

```text
apps/web        React + Vite 网站，Recharts 图表
apps/mobile     React Native + Expo 原生界面
packages/core   整数分金额、转账、余额、预算汇总、CSV、周期账单
.github         构建校验与 Cloudflare Pages 发布工作流
```

## 已编写功能

- Web：总览、收支趋势、分类图表、收支与转账增删改、月份切换、搜索和类型/账户/分类筛选、账户新增与重命名、分类新增/重命名/排序、预算调整、周期账单启停和删除、CSV 校验预览与导入导出、JSON 备份恢复。
- RN：独立触屏界面、底部导航、总览与趋势条形图、收支与转账增删改、月份与搜索筛选、账户/分类新增、预算调整、周期账单新增与启停、系统分享导出、文件选择导入、JSON 备份恢复。
- 两端共用业务计算，转账不计入收入或支出；金额按整数分保存。

首次启动包含示例数据，可逐笔删除后开始自己的账本。Web 使用 localStorage，RN 使用 AsyncStorage；两端不自动同步，可通过 JSON 备份迁移。设备浏览器或应用数据被清除后，本地账本也会丢失，请定期备份。

周期规则为每月执行，打开应用或手动补记时处理到期记录，不是后台推送。月末日期自动夹到当月最后一天，以规则原始日期继续后续月份。暂停后恢复会补记已到期月份。

CSV 金额单位为元，使用英文列名 `date,type,amount,category,account,target,note`。类型为 `income`、`expense`、`transfer`；账户填 ID，初始 ID 为 `bank`、`wechat`、`cash`。Web 设置页提供模板。导入整批校验，通过后由用户确认；重复导入同一 CSV 会新增重复记录。

## Cloudflare Pages

GitHub 代码上传后，在 Cloudflare Workers & Pages 创建 **Pages** 项目并连接仓库：

| 设置 | 值 |
| --- | --- |
| 根目录 | 仓库根目录 |
| 安装 | `npm install` |
| 构建命令 | `npm run build` |
| 输出目录 | `apps/web/dist` |
| Node 环境变量 | `NODE_VERSION=22` |

也可使用 GitHub Actions 手动发布：先在 Cloudflare 创建 Pages 项目，在仓库 Secrets 配置 `CLOUDFLARE_API_TOKEN`（限定账户的 Pages 编辑权限）、`CLOUDFLARE_ACCOUNT_ID`；仓库 Variables 配置 `CLOUDFLARE_PROJECT_NAME`，默认 `qingzhang`。在 Actions 运行 **Deploy Cloudflare Pages**。生产环境可设置 required reviewers。凭据不要提交到代码，也不需要放在网页客户端。

本地发布：`npm run deploy`，首次需通过 `npx wrangler login` 完成 Cloudflare 登录。项目名有冲突时修改命令和 Cloudflare 配置。Pages 只承载网站，RN 应用需要单独打包。

## 手机测试包

```sh
cd apps/mobile
npx eas-cli login
npx eas-cli build:configure
npx eas-cli build --profile preview --platform android
```

安卓预览产物为 APK。iOS 内部分发需 Apple 开发者账户、设备注册及签名；正式商店发布也需要相应平台账户。当前未生成或签名二进制包。

## 验证状态与待办

- 已通过本地核心逻辑自动测试。
- GitHub Actions 已通过共享核心测试与 Web 生产构建；Expo 打包、浏览器交互验收和手机真机验证尚未完成。
- 源码已上传至 `haoLingLing/AI`；Cloudflare 正式发布仍需要账户、Pages 项目及仓库密钥配置。
- 下一步：补充 RN 分类重命名/排序/停用、账户重命名、周期规则编辑、登录和云同步、移动端通知及无障碍实机验收。
- 当前预算是重复用于每个月的预算上限；尚不支持按月保存不同预算。
- 网站与手机应用均为本地单人账本，不包含云数据库或后端账户系统。

## 来源

- [Expo SDK 55 兼容矩阵](https://docs.expo.dev/versions/v55.0.0/)
- [Cloudflare Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)

依赖安装成功后建议提交生成的 `package-lock.json`，并将 CI 中的 `npm install` 改为 `npm ci`，固定完整依赖树。
