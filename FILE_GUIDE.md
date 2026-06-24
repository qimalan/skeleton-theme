# 文件功能文档

这份文档说明本主题每个文件的职责和典型使用场景。它适合作为二次开发、交付前审查、外包项目改版时的文件索引。

## 根目录

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `.gitignore` | Git 忽略规则，排除系统文件、`node_modules/`、Shopify CLI 本地目录、发布压缩包等。 | 本地开发和版本管理时使用，避免把临时文件提交进仓库。 |
| `.shopifyignore` | Shopify CLI 同步忽略规则。当前保留示例注释，没有主动忽略主题文件。 | 使用 `shopify theme push/pull/dev` 时控制哪些文件不参与 Shopify 同步。 |
| `.theme-check.yml` | Theme Check 配置，继承 Shopify 推荐规则。 | 运行 `shopify theme check` 时用于静态检查 Liquid、schema 和主题结构。 |
| `README.md` | 项目快速介绍、能力概览和启动方式。 | 新项目启动、交付说明、团队成员快速了解主题定位时使用。 |
| `FILE_GUIDE.md` | 当前文件，说明每个文件的作用和使用场景。 | 后续维护、按需删改模块、给客户或协作者解释主题结构时使用。 |

## assets

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `assets/critical.css` | 全局基础样式：reset、布局容器、按钮、表单、卡片、筛选、分页、购物车抽屉、预测搜索等通用 UI。 | 修改全站视觉基调、通用组件样式、布局间距、全局 utility 时使用。 |
| `assets/theme.js` | 前端交互脚本：变体选择同步、预测搜索、购物车抽屉、产品媒体弹窗。 | 调整商品变体交互、AJAX 加购、购物车抽屉刷新、搜索建议、媒体弹窗行为时使用。 |
| `assets/icon-account.svg` | 账号图标静态资源。 | 作为备用或独立图标资源使用；当前主题主要通过 `snippets/icon.liquid` 渲染内联图标。 |
| `assets/icon-cart.svg` | 购物车图标静态资源。 | 作为备用或独立图标资源使用；当前主题主要通过 `snippets/icon.liquid` 渲染内联图标。 |

## config

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `config/settings_schema.json` | 主题全局设置 schema：字体、布局宽度、颜色、圆角、品牌 logo、页头、卡片、购物车、页脚、社交链接等。 | 需要在 Shopify 主题编辑器里增加或调整全局配置项时使用。 |
| `config/settings_data.json` | Shopify 主题编辑器生成的当前设置数据。当前基本为空。 | 店铺安装后由后台保存实际配置；通常不手写业务逻辑。 |

## layout

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `layout/theme.liquid` | 主站布局，输出 `<html>`、`<head>`、全局 CSS/JS、header group、footer group 和页面内容。 | 调整全站资源加载、全局结构、插入全局脚本或全局组件时使用。 |
| `layout/password.liquid` | 密码页专用布局。 | 店铺未开放、密码访问页需要独立结构时使用。 |

## locales

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `locales/en.default.json` | 前台用户可见文案翻译：导航、分页、商品、购物车、搜索、联系表单、密码页等。 | 修改英文前台文案或新增 `t` 翻译键时使用。 |
| `locales/en.default.schema.json` | 主题编辑器 schema 文案翻译。 | 将 schema 的 label/name 改成翻译键时使用；当前大部分 schema 仍直接写英文。 |

## sections

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `sections/404.liquid` | 404 页面主内容，显示未找到提示和返回购物按钮。 | 修改 404 页面内容、按钮去向或空状态体验时使用。 |
| `sections/announcement-bar.liquid` | 顶部公告栏，支持图标、文案、链接、背景色、文字色、对齐方式。 | 做免邮提示、活动公告、服务承诺横条时使用。 |
| `sections/apps.liquid` | App block 容器，渲染 Shopify app 插入的块。 | 集成评论、订阅、营销、页面构建器等 app block 时使用。 |
| `sections/article.liquid` | 文章详情页，输出文章标题、主图、正文和评论表单。 | 修改博客文章详情、评论列表或评论提交体验时使用。 |
| `sections/blog.liquid` | 博客列表页，分页展示文章卡片。 | 修改博客首页、文章列表卡片、每页数量时使用。 |
| `sections/cart-drawer.liquid` | 购物车抽屉 markup，配合 `CartDrawer` JS 做 AJAX 加购、数量修改、移除和结账入口。 | 调整抽屉购物车 UI、商品行、结账入口、空购物车状态时使用。 |
| `sections/cart.liquid` | 独立购物车页面，支持数量更新、删除、结账。 | 需要保留非抽屉购物车页面或做完整购物车页改版时使用。 |
| `sections/collapsible-content.liquid` | FAQ/折叠内容 section，支持标题、说明、布局、默认展开第一项。 | 做常见问题、配送说明、售后政策、产品说明折叠块时使用。 |
| `sections/collection.liquid` | 集合详情页，展示标题、描述、筛选排序、商品网格和分页。 | 商品分类页、筛选排序、商品列表布局调整时使用。 |
| `sections/collections.liquid` | 全部集合列表页，分页展示 collection 卡片。 | `/collections` 页面或集合入口页需要展示多个系列时使用。 |
| `sections/contact-form.liquid` | 联系表单 section 外壳，渲染标题和 `snippets/contact-form.liquid`。 | 在页面编辑器中插入联系表单时使用。 |
| `sections/custom-liquid.liquid` | 后台可编辑的自定义 Liquid 容器。 | 项目交付后需要临时插入少量 Liquid/HTML，而不新增 section 文件时使用。 |
| `sections/featured-collection.liquid` | 精选集合 section，支持标题、说明、列数、商品数量、查看全部按钮。 | 首页推荐商品、专题页商品区、落地页商品网格时使用。 |
| `sections/featured-product.liquid` | 精选单品 section，支持媒体、价格、变体选择、库存提示、加购。 | 首页主推单品、活动页单品模块、简化版商品购买区时使用。 |
| `sections/footer-group.json` | 页脚 section group 配置，默认包含 newsletter 和 footer。 | 控制全站 footer group 默认组成；通常由主题编辑器维护。 |
| `sections/footer.liquid` | 页脚主体，包含品牌说明、菜单、支付图标、社交图标、地区语言选择、政策链接。 | 修改页脚导航、品牌信息、社交链接区、政策链接展示时使用。 |
| `sections/header-group.json` | 页头 section group 配置，默认包含 announcement bar 和 header。 | 控制全站 header group 默认组成；通常由主题编辑器维护。 |
| `sections/header.liquid` | 页头主体，包含品牌、桌面菜单、移动菜单、搜索、地区语言、账号、购物车入口。 | 修改导航、移动菜单、预测搜索入口、购物车图标、账号入口时使用。 |
| `sections/image-banner.liquid` | 图片横幅/hero section，支持桌面/移动图、遮罩、内容位置、标题、正文、双按钮。 | 首页首屏、活动页 hero、品牌视觉区时使用。 |
| `sections/image-with-text.liquid` | 图文 section，支持图片宽度、图文顺序、标题、说明、按钮。 | 品牌故事、服务说明、图文卖点区时使用。 |
| `sections/metafield-content.liquid` | 动态 metafield 内容 section，可读取 product/collection/page/article 的指定 namespace/key。 | 用 metafield 或 metaobject 输出规格、详情、额外说明等动态内容时使用。 |
| `sections/multicolumn.liquid` | 多列内容 section，支持图片或图标、标题、富文本、链接。 | 信任卖点、服务承诺、流程说明、功能亮点时使用。 |
| `sections/newsletter.liquid` | 邮件订阅 section，使用 Shopify customer form 写入 newsletter tag。 | 页脚订阅、活动页收集邮件、品牌内容页订阅入口时使用。 |
| `sections/page.liquid` | 普通页面主内容，输出页面标题和页面正文。 | About、Policy、自定义 CMS 页面等普通页面模板使用。 |
| `sections/password.liquid` | 店铺密码页内容，输出密码提示和 storefront password 表单。 | 店铺未发布或维护模式时使用。 |
| `sections/predictive-search.liquid` | 预测搜索结果 section，返回商品、查询建议、集合、页面、文章结果。 | 被 `assets/theme.js` 异步请求，用于页头搜索建议下拉。 |
| `sections/product.liquid` | 商品详情页主 section，包含媒体画廊、缩略图、媒体弹窗、价格、SKU、变体、加购、动态结账、支付图标、信息 blocks、metafield specs。 | 商品页核心维护文件；改商品购买体验、媒体布局、详情 block、库存提示时使用。 |
| `sections/rich-text.liquid` | 富文本 section，支持内容位置、对齐、全宽、上下 padding、标题、正文、按钮。 | 简短营销文案、首页说明区、落地页 CTA 文案时使用。 |
| `sections/search.liquid` | 搜索页，包含搜索表单、结果数量、商品/文章/页面结果列表和分页。 | `/search` 页面和搜索结果体验调整时使用。 |

## snippets

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `snippets/card-collection.liquid` | 集合卡片，输出集合图片、标题、描述。 | 集合列表页、首页集合入口、自定义集合网格复用。 |
| `snippets/card-product.liquid` | 商品卡片，输出商品图、二图 hover、品牌、标题、价格、售罄/促销 badge、quick add。 | 集合页、搜索页、精选集合、商品推荐等商品网格复用。 |
| `snippets/contact-form.liquid` | 联系表单主体，包含姓名、邮箱、电话、消息和提交状态。 | 被 `sections/contact-form.liquid` 渲染；需要复用联系表单字段时使用。 |
| `snippets/css-variables.liquid` | 输出字体 `font-face` 和全站 CSS 变量。 | 修改全局 design tokens、字体、颜色、圆角、页宽变量时使用。 |
| `snippets/facets.liquid` | 集合/搜索筛选排序 UI，包含排序、筛选组、活跃筛选 chip、价格筛选。 | 集合页筛选排序逻辑复用；后续扩展 AJAX 筛选也从这里入手。 |
| `snippets/icon.liquid` | 内联 SVG 图标集合，通过 `icon` 参数选择图标。 | 按钮、导航、公告、卖点卡、产品信息块等需要小图标时使用。 |
| `snippets/image.liquid` | 响应式图片输出，可选链接包装、class、尺寸、裁剪和 loading。 | 所有商品图、集合图、文章图、section 图片的通用渲染入口。 |
| `snippets/localization-form.liquid` | 国家/地区和语言选择表单。 | 页头或页脚需要切换市场、货币、语言时使用。 |
| `snippets/meta-tags.liquid` | SEO 和社交分享 meta：canonical、title、description、OG、Twitter、商品结构化数据。 | 修改全站 SEO、社交分享图文、产品结构化数据时使用。 |
| `snippets/pagination.liquid` | 分页组件，支持上一页、下一页、页码和当前页状态。 | 博客、集合、搜索、评论、集合列表分页复用。 |
| `snippets/price-facet.liquid` | 价格区间筛选输入框。 | 被 `snippets/facets.liquid` 调用，用于集合价格筛选。 |
| `snippets/price.liquid` | 价格组件，支持商品/变体价格、compare-at price、价格区间起价、货币代码设置。 | 商品卡片、商品页、精选商品等价格展示复用。 |
| `snippets/product-media.liquid` | 商品媒体渲染，支持图片、视频、外部视频、3D model。 | 商品页媒体画廊和精选商品媒体区复用。 |
| `snippets/social-icons.liquid` | 社交链接列表，读取全局社交 URL 设置。 | 页脚或其他位置需要输出社交入口时使用。 |
| `snippets/variant-picker.liquid` | 商品变体选择器，输出 option select 和变体 JSON 数据。 | 商品页和精选商品页变体联动复用，配合 `VariantSelects` JS。 |

## templates

| 文件 | 作用 | 使用场景 |
| --- | --- | --- |
| `templates/404.json` | 404 页面模板，挂载 `sections/404.liquid`。 | 404 页面结构配置。 |
| `templates/article.json` | 文章详情模板，挂载 `sections/article.liquid`。 | 博客文章详情页面结构配置。 |
| `templates/blog.json` | 博客列表模板，挂载 `sections/blog.liquid`。 | 博客首页/博客分类页结构配置。 |
| `templates/cart.json` | 购物车页面模板，挂载 `sections/cart.liquid`。 | `/cart` 页面结构配置。 |
| `templates/collection.json` | 集合详情模板，挂载 `sections/collection.liquid`。 | 商品集合页结构配置。 |
| `templates/gift_card.liquid` | 礼品卡专用 Liquid 模板，独立输出余额、过期状态、礼品卡图片、卡号、Apple Wallet 链接。 | Shopify 礼品卡页面使用，不能用常规 JSON section 模板替代。 |
| `templates/index.json` | 首页模板，默认包含 image banner、multicolumn、featured collection、FAQ、apps。 | 首页默认结构和演示内容配置。 |
| `templates/list-collections.json` | 全部集合列表模板，挂载 `sections/collections.liquid`。 | `/collections` 页面结构配置。 |
| `templates/page.contact.json` | 联系页面模板，挂载 `sections/contact-form.liquid`。 | Contact 页面使用，便于和普通 page 模板区分。 |
| `templates/page.json` | 普通页面模板，挂载 `sections/page.liquid`。 | About、FAQ、政策以外的普通内容页结构配置。 |
| `templates/password.json` | 密码页模板，挂载 `sections/password.liquid`。 | 店铺密码页结构配置。 |
| `templates/product.json` | 商品页模板，默认包含主商品 section 和 metafield content section。 | 商品详情页默认结构配置。 |
| `templates/search.json` | 搜索页模板，挂载 `sections/search.liquid`。 | `/search` 页面结构配置。 |

## 维护建议

- 改全站视觉，优先看 `assets/critical.css` 和 `snippets/css-variables.liquid`。
- 改可拖拽内容模块，优先看 `sections/*.liquid` 的 schema 和 HTML。
- 改重复 UI，优先抽到 `snippets/`，避免在多个 section 复制。
- 改路由页面结构，优先看 `templates/*.json`。
- 改前端交互，集中看 `assets/theme.js`，不要在 section 里散落内联脚本。
- 改文案，优先放到 `locales/en.default.json`，尤其是前台用户可见文本。
