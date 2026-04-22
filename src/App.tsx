/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, memo } from 'react';
import { ShoppingCart, User, Heart, Search, X, CheckCircle2, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// 圖片加載穩定化組件
const ProductImage = memo(({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const fallbackUrl = "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=40";

  return (
    <div className={`relative bg-slate-100 overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        src={error ? fallbackUrl : src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {error && !loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
          <ImageOff className="w-8 h-8 mb-2 opacity-20" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Image Unavailable</span>
        </div>
      )}
    </div>
  );
});

// 優化後的商品卡片組件
const ProductCard = memo(({ product, wishlist, toggleWishlist, addToCart, onProductClick }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98 }}
    transition={{ duration: 0.2 }}
    className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
  >
    <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onProductClick(product)}>
      <ProductImage 
        src={product.img} 
        alt={product.name} 
        className="w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
      {product.tag && (
        <div className="absolute top-4 left-4 px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-lg">
          {product.tag}
        </div>
      )}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-4 right-4 p-2 backdrop-blur-sm rounded-full transition-all ${
          wishlist.includes(product.id) ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/80 text-slate-400 hover:text-rose-500'
        }`}
      >
        <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-white' : ''}`} />
      </button>
    </div>
    <div className="p-6">
      <h3 className="font-semibold text-slate-800 text-lg line-clamp-1">{product.name}</h3>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600">${product.price.toLocaleString()}</span>
        <button 
          onClick={() => addToCart(product)}
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-indigo-600 transition-colors shadow-sm"
        >
          加入購物車
        </button>
      </div>
    </div>
  </motion.div>
));

// 模擬商品資料 (擴充至 100 件商品並分為 4 個分類)
const INITIAL_PRODUCTS = [
  // 夏季女生 (Summer Women, 25 items)
  { id: 1, season: 'summer', gender: 'women', name: '法式復古碎花連身裙', price: 1680, tag: '熱銷', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
  { id: 3, season: 'summer', gender: 'women', name: '高腰修身牛仔褲', price: 980, tag: '優惠', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80' },
  { id: 8, season: 'summer', gender: 'women', name: '莫代爾柔軟居家服組', price: 1500, tag: '新品', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80' },
  { id: 14, season: 'summer', gender: 'women', name: '波西米亞風編織草帽', price: 680, tag: '新品', img: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b721?w=500&q=80' },
  { id: 15, season: 'summer', gender: 'women', name: '透氣亞麻無袖背心', price: 850, tag: '優惠', img: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=500&q=80' },
  { id: 22, season: 'summer', gender: 'women', name: '夏日度假感絲質半身裙', price: 1350, tag: '熱銷', img: 'https://images.unsplash.com/photo-1581059232257-82639963c05e?w=500&q=80' },
  { id: 23, season: 'summer', gender: 'women', name: '手工編織大容量草編包', price: 1100, tag: '推薦', img: 'https://images.unsplash.com/photo-1572196284554-4e321b0e7e0b?w=500&q=80' },
  { id: 24, season: 'summer', gender: 'women', name: '極簡細帶皮革涼鞋', price: 1250, tag: '新品', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80' },
  { id: 101, season: 'summer', gender: 'women', name: '雪紡荷葉邊透視襯衫', price: 1150, tag: '新品', img: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500&q=80' },
  { id: 102, season: 'summer', gender: 'women', name: '冰絲涼感顯瘦寬褲', price: 890, tag: '熱銷', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80' },
  { id: 103, season: 'summer', gender: 'women', name: '蕾絲勾花鏤空罩衫', price: 1480, tag: '精選', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&q=80' },
  { id: 104, season: 'summer', gender: 'women', name: '韓系一字領露肩上衣', price: 790, tag: '熱銷', img: 'https://images.unsplash.com/photo-1516750105099-4b8a83e217ee?w=500&q=80' },
  { id: 105, season: 'summer', gender: 'women', name: '文藝棉麻格紋吊帶裙', price: 1280, tag: '推薦', img: 'https://images.unsplash.com/photo-1485968324823-7a766333c108?w=500&q=80' },
  { id: 106, season: 'summer', gender: 'women', name: '甜美系亮色系指甲油組', price: 350, tag: '配件', img: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&q=80' },
  { id: 107, season: 'summer', gender: 'women', name: '運動感快乾瑜伽短褲', price: 680, tag: '運動', img: 'https://images.unsplash.com/photo-1506629082925-fe69830da423?w=500&q=80' },
  { id: 108, season: 'summer', gender: 'women', name: '極細珠寶感鎖骨鍊', price: 1980, tag: '精品', img: 'https://images.unsplash.com/photo-1515562141521-7a6ce0ee8157?w=500&q=80' },
  { id: 109, season: 'summer', gender: 'women', name: '防曬大帽簷抗 UV 折疊帽', price: 550, tag: '熱銷', img: 'https://images.unsplash.com/photo-1494639343114-11e819b5dcb1?w=500&q=80' },
  { id: 110, season: 'summer', gender: 'women', name: '莫蘭迪色系彈性髮圈', price: 150, tag: '配件', img: 'https://images.unsplash.com/photo-1582208993264-fc794a317719?w=500&q=80' },
  { id: 111, season: 'summer', gender: 'women', name: '氣質名媛風方頭涼拖鞋', price: 1380, tag: '新品', img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=500&q=80' },
  { id: 112, season: 'summer', gender: 'women', name: '日系糖果色中筒襪3雙組', price: 290, tag: '配件', img: 'https://images.unsplash.com/photo-1582967788606-a171c1070db9?w=500&q=80' },
  { id: 113, season: 'summer', gender: 'women', name: '撞色拼接連體運動泳衣', price: 1850, tag: '熱銷', img: 'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?w=500&q=80' },
  { id: 114, season: 'summer', gender: 'women', name: '透明感糖果色圓框眼鏡', price: 480, tag: '配件', img: 'https://images.unsplash.com/photo-1513673048123-08505a673ab1?w=500&q=80' },
  { id: 115, season: 'summer', gender: 'women', name: '幾何刺繡帆布水桶包', price: 920, tag: '推薦', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' },
  { id: 116, season: 'summer', gender: 'women', name: '歐美風極簡削肩背心', price: 590, tag: '熱銷', img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=500&q=80' },
  { id: 117, season: 'summer', gender: 'women', name: '純白真絲刺繡睡裙', price: 2100, tag: '精品', img: 'https://images.unsplash.com/photo-1579412691512-9c3f59f63777?w=500&q=80' },

  // 夏季男生 (Summer Men, 25 items)
  { id: 4, season: 'summer', gender: 'men', name: '經典牛津布襯衫', price: 1350, tag: '熱銷', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=500&q=80' },
  { id: 6, season: 'summer', gender: 'men', name: '重磅純棉素色 T-Shirt', price: 650, tag: '優惠', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 13, season: 'summer', gender: 'men', name: '輕薄亞麻休閒短褲', price: 1100, tag: '新品', img: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80' },
  { id: 16, season: 'summer', gender: 'men', name: '機能快乾運動 Polo 衫', price: 1280, tag: '推薦', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80' },
  { id: 17, season: 'summer', gender: 'men', name: '戶外探險遮陽帽', price: 750, tag: '新品', img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&q=80' },
  { id: 25, season: 'summer', gender: 'men', name: '復古印花海灘短褲', price: 890, tag: '熱銷', img: 'https://images.unsplash.com/photo-1560060141-7b9018741bed?w=500&q=80' },
  { id: 26, season: 'summer', gender: 'men', name: '輕便防滑夾腳拖鞋', price: 450, tag: '優惠', img: 'https://images.unsplash.com/photo-1520639889457-41881cb9460d?w=500&q=80' },
  { id: 27, season: 'summer', gender: 'men', name: '經典飛機師太陽眼鏡', price: 1850, tag: '新品', img: 'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?w=500&q=80' },
  { id: 118, season: 'summer', gender: 'men', name: '抗 UV 機能連帽薄外套', price: 1580, tag: '熱銷', img: 'https://images.unsplash.com/photo-1620241608701-94913f1e11a3?w=500&q=80' },
  { id: 119, season: 'summer', gender: 'men', name: '日系美式工裝多口袋背心', price: 1450, tag: '推薦', img: 'https://images.unsplash.com/photo-1588267277150-1384024840cd?w=500&q=80' },
  { id: 120, season: 'summer', gender: 'men', name: '彈性束口九分休閒長褲', price: 1180, tag: '熱銷', img: 'https://images.unsplash.com/photo-1511196090751-ad0963325c75?w=500&q=80' },
  { id: 121, season: 'summer', gender: 'men', name: '古巴領夏威夷印花襯衫', price: 1250, tag: '新品', img: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=500&q=80' },
  { id: 122, season: 'summer', gender: 'men', name: '情侶款基礎印花短袖上衣', price: 590, tag: '推薦', img: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf027?w=500&q=80' },
  { id: 123, season: 'summer', gender: 'men', name: '帆布拼接皮革雙肩背包', price: 2300, tag: '精選', img: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80' },
  { id: 124, season: 'summer', gender: 'men', name: '經典海軍藍條紋短汗衫', price: 780, tag: '熱銷', img: 'https://images.unsplash.com/photo-1523381235212-d73f8a385171?w=500&q=80' },
  { id: 125, season: 'summer', gender: 'men', name: '運動型止汗透氣頭帶', price: 250, tag: '配件', img: 'https://images.unsplash.com/photo-1533038590840-1cde6b66b721?w=500&q=80' },
  { id: 126, season: 'summer', gender: 'men', name: '輕薄款商務西裝短褲', price: 1350, tag: '新品', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
  { id: 127, season: 'summer', gender: 'men', name: '復古運動風格防風衣', price: 1980, tag: '精選', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 128, season: 'summer', gender: 'men', name: '全棉舒適透氣內褲4入組', price: 880, tag: '熱銷', img: 'https://images.unsplash.com/photo-1583204910815-56221f7c8f4b?w=500&q=80' },
  { id: 129, season: 'summer', gender: 'men', name: '簡約純銀十字架項鍊', price: 1650, tag: '配件', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80' },
  { id: 130, season: 'summer', gender: 'men', name: '網面透氣跑步運動鞋', price: 2600, tag: '熱銷', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { id: 131, season: 'summer', gender: 'men', name: '牛仔藍水洗棒球帽', price: 650, tag: '新品', img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80' },
  { id: 132, season: 'summer', gender: 'men', name: '經典款黑色皮帶(真皮)', price: 1200, tag: '配件', img: 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?w=500&q=80' },
  { id: 133, season: 'summer', gender: 'men', name: '吸濕排汗運動背心', price: 550, tag: '運動', img: 'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500&q=80' },
  { id: 134, season: 'summer', gender: 'men', name: '防水款矽膠潛水手錶', price: 3500, tag: '精品', img: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&q=80' },

  // 冬季女生 (Winter Women, 25 items)
  { id: 2, season: 'winter', gender: 'women', name: '簡約羊毛針織衫', price: 1200, tag: '新品', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80' },
  { id: 7, season: 'winter', gender: 'women', name: '英倫風格紋西裝外套', price: 3200, tag: '熱銷', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&q=80' },
  { id: 9, season: 'winter', gender: 'women', name: '優雅真絲混紡圍巾', price: 880, tag: '優惠', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80' },
  { id: 18, season: 'winter', gender: 'women', name: '長版修身羊絨大衣', price: 5800, tag: '精品', img: 'https://images.unsplash.com/photo-1539533377285-33ecb1802963?w=500&q=80' },
  { id: 19, season: 'winter', gender: 'women', name: '保暖刷毛內搭褲', price: 790, tag: '熱銷', img: 'https://images.unsplash.com/photo-1506629082925-fe69830da423?w=500&q=80' },
  { id: 28, season: 'winter', gender: 'women', name: '經典款黑色皮革長靴', price: 3500, tag: '新品', img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80' },
  { id: 29, season: 'winter', gender: 'women', name: '法式優雅羊毛貝雷帽', price: 950, tag: '新品', img: 'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=500&q=80' },
  { id: 30, season: 'winter', gender: 'women', name: '蓬鬆保暖羽絨長版外套', price: 4200, tag: '推薦', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=500&q=80' },
  { id: 135, season: 'winter', gender: 'women', name: '高領寬鬆混紡毛衣', price: 1850, tag: '熱銷', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&q=80' },
  { id: 136, season: 'winter', gender: 'women', name: '暖絨面皮革手套', price: 1100, tag: '配件', img: 'https://images.unsplash.com/photo-1521118146400-09253457002b?w=500&q=80' },
  { id: 137, season: 'winter', gender: 'women', name: '復古牛角扣羊毛外套', price: 3980, tag: '精品', img: 'https://images.unsplash.com/photo-1539106602056-1f705b2a0951?w=500&q=80' },
  { id: 138, season: 'winter', gender: 'women', name: '加絨加厚防寒耳罩', price: 450, tag: '熱銷', img: 'https://images.unsplash.com/photo-1616239921446-2f27ecc10785?w=500&q=80' },
  { id: 139, season: 'winter', gender: 'women', name: '雪地防水登山短靴', price: 3200, tag: '推薦', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
  { id: 140, season: 'winter', gender: 'women', name: '絲絨感垂墜寬腿長褲', price: 1250, tag: '新品', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80' },
  { id: 141, season: 'winter', gender: 'women', name: '菱格紋絎縫斜背包', price: 2100, tag: '熱銷', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' },
  { id: 142, season: 'winter', gender: 'women', name: '羊毛氈保暖室內拖鞋', price: 580, tag: '居家', img: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=500&q=80' },
  { id: 143, season: 'winter', gender: 'women', name: '亮面防風短版羽絨外套', price: 3600, tag: '熱銷', img: 'https://images.unsplash.com/photo-1604176402325-1e3895e792e3?w=500&q=80' },
  { id: 144, season: 'winter', gender: 'women', name: '針織麻花長款圍巾', price: 790, tag: '推薦', img: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&q=80' },
  { id: 145, season: 'winter', gender: 'women', name: '豹紋印花人造皮草夾克', price: 4200, tag: '精品', img: 'https://images.unsplash.com/photo-1548624313-0396c73df574?w=500&q=80' },
  { id: 146, season: 'winter', gender: 'women', name: '金屬扣裝飾羊毛寬帽簷', price: 1550, tag: '精選', img: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=500&q=80' },
  { id: 147, season: 'winter', gender: 'women', name: '厚底漆皮樂福鞋', price: 2800, tag: '新品', img: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' },
  { id: 148, season: 'winter', gender: 'women', name: '條紋拼色羊駝毛毛衣', price: 2400, tag: '熱銷', img: 'https://images.unsplash.com/photo-1517231939912-d99003006334?w=500&q=80' },
  { id: 149, season: 'winter', gender: 'women', name: '星空紫感顯白長袖上衣', price: 850, tag: '推薦', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&q=80' },
  { id: 150, season: 'winter', gender: 'women', name: '全羊毛手工訂製大衣', price: 8800, tag: '精品', img: 'https://images.unsplash.com/photo-1539533377285-33ecb1802963?w=500&q=80' },
  { id: 151, season: 'winter', gender: 'women', name: '香氛暖冬套裝禮盒', price: 1680, tag: '精選', img: 'https://images.unsplash.com/photo-1515562141521-7a6ce0ee8157?w=500&q=80' },

  // 冬季男生 (Winter Men, 25 items)
  { id: 5, season: 'winter', gender: 'men', name: '防風機能連帽外套', price: 2800, tag: '熱銷', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 10, season: 'winter', gender: 'men', name: '商務休閒直筒西裝褲', price: 1980, tag: '新品', img: 'https://images.unsplash.com/photo-1624371414361-e6e0efc8c030?w=500&q=80' },
  { id: 12, season: 'winter', gender: 'men', name: '極致輕羽絨背心', price: 1800, tag: '熱銷', img: 'https://images.unsplash.com/photo-1621072156002-e2fcc103e869?w=500&q=80' },
  { id: 20, season: 'winter', gender: 'men', name: '羊毛混紡高領毛衣', price: 2400, tag: '熱銷', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80' },
  { id: 21, season: 'winter', gender: 'men', name: '防潑水軍裝派克大衣', price: 4500, tag: '精品', img: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&q=80' },
  { id: 31, season: 'winter', gender: 'men', name: '英倫風雀爾喜皮革靴', price: 3800, tag: '新品', img: 'https://images.unsplash.com/photo-1613425651722-132da757754b?w=500&q=80' },
  { id: 32, season: 'winter', gender: 'men', name: '復古粗紡燈心絨長褲', price: 1650, tag: '優惠', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80' },
  { id: 33, season: 'winter', gender: 'men', name: '經典美式翻領毛絨夾克', price: 3200, tag: '熱銷', img: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&q=80' },
  { id: 152, season: 'winter', gender: 'men', name: '城市機能防水後背包', price: 2850, tag: '推薦', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
  { id: 153, season: 'winter', gender: 'men', name: '極地保暖羊絨脖巾', price: 980, tag: '配件', img: 'https://images.unsplash.com/photo-1520626337972-ebf863448db6?w=500&q=80' },
  { id: 154, season: 'winter', gender: 'men', name: '修身美式重磅帽衛衣', price: 1680, tag: '熱銷', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80' },
  { id: 155, season: 'winter', gender: 'men', name: '多功能數位運動電子錶', price: 4200, tag: '精品', img: 'https://images.unsplash.com/photo-1522338242992-e1a53aa06bc3?w=500&q=80' },
  { id: 156, season: 'winter', gender: 'men', name: '全棉抓絨休閒縮口褲', price: 1350, tag: '新品', img: 'https://images.unsplash.com/photo-1580934911767-fe48efdf2a28?w=500&q=80' },
  { id: 157, season: 'winter', gender: 'men', name: '極輕量連帽防寒服', price: 2900, tag: '熱銷', img: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=500&q=80' },
  { id: 158, season: 'winter', gender: 'men', name: '商務風羊毛混紡西裝背心', price: 2200, tag: '精選', img: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=80' },
  { id: 159, season: 'winter', gender: 'men', name: '復古格子元素長袖襯衫', price: 1280, tag: '熱銷', img: 'https://images.unsplash.com/photo-1578587018452-892bace96d21?w=500&q=80' },
  { id: 160, season: 'winter', gender: 'men', name: '保暖護耳款雷鋒帽', price: 850, tag: '配件', img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500&q=80' },
  { id: 161, season: 'winter', gender: 'men', name: '撞色拼接機能滑雪褲', price: 3500, tag: '新品', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { id: 162, season: 'winter', gender: 'men', name: '經典海軍藍羊絨毛衣', price: 1980, tag: '精選', img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80' },
  { id: 163, season: 'winter', gender: 'men', name: '戶外感大底戰術靴', price: 4800, tag: '精品', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
  { id: 164, season: 'winter', gender: 'men', name: '全棉加厚三雙裝中筒襪', price: 480, tag: '配件', img: 'https://images.unsplash.com/photo-1582967788606-a171c1070db9?w=500&q=80' },
  { id: 165, season: 'winter', gender: 'men', name: '經典美式橫式皮夾', price: 1350, tag: '熱銷', img: 'https://images.unsplash.com/photo-1601390111166-51f67f65f02c?w=500&q=80' },
  { id: 166, season: 'winter', gender: 'men', name: '保暖修身彈性發熱衣', price: 690, tag: '熱銷', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80' },
  { id: 167, season: 'winter', gender: 'men', name: '羊毛內裡格紋護照套', price: 750, tag: '旅行', img: 'https://images.unsplash.com/photo-1539651044670-315229da9d2f?w=500&q=80' },
  { id: 168, season: 'winter', gender: 'men', name: '高質感真皮電腦公事包', price: 5800, tag: '精品', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
];

const INITIAL_COUPONS = [
  { id: 'WELCOME100', name: '開站慶專屬折價券', discount: 100, minSpend: 500, desc: '全店滿 $500 可折抵' },
  { id: 'SEASON200', name: '換季限時加碼券', discount: 200, minSpend: 2000, desc: '冬季商品滿 $2000 使用' },
  { id: 'VIP10', name: 'VIP 會員獨享券', discount: 300, minSpend: 3000, desc: '滿 $3000 現折 $300' }
];

type CategoryKey = 'summer-women' | 'summer-men' | 'winter-women' | 'winter-men';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryKey>('summer-women');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // 效能優化：搜尋防抖
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // 購物功能增強
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);

  // 優惠券相關狀態
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [claimedCoupons, setClaimedCoupons] = useState<string[]>([]);

  // 登入相關狀態
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');

  // 極致過濾邏輯
  const filteredProducts = useMemo(() => {
    const query = debouncedQuery.toLowerCase().trim();
    
    if (query !== '') {
      const isMenQuery = query.includes('男') || query.includes('man') || query.includes('men');
      const isWomenQuery = query.includes('女') || query.includes('woman') || query.includes('women');
      const isSummerQuery = query.includes('夏') || query.includes('summer');
      const isWinterQuery = query.includes('冬') || query.includes('winter');

      return INITIAL_PRODUCTS.filter(p => {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesGender = (isMenQuery && p.gender === 'men') || (isWomenQuery && p.gender === 'women');
        const matchesSeason = (isSummerQuery && p.season === 'summer') || (isWinterQuery && p.season === 'winter');
        const matchesTag = p.tag && p.tag.toLowerCase().includes(query);
        
        // 組合篩選邏輯
        if (isMenQuery || isWomenQuery || isSummerQuery || isWinterQuery) {
          if ((isSummerQuery || isWinterQuery) && (isMenQuery || isWomenQuery)) {
            return matchesSeason && matchesGender;
          }
          return matchesSeason || matchesGender || matchesTag;
        }
        return matchesName || matchesTag;
      });
    }

    // 標籤篩選與分類篩選併行
    return INITIAL_PRODUCTS.filter(p => {
      const categoryMatch = `${p.season}-${p.gender}` === activeTab;
      const tagMatch = !activeTagFilter || p.tag === activeTagFilter;
      return categoryMatch && tagMatch;
    });
  }, [debouncedQuery, activeTab, activeTagFilter]);

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(wishId => wishId !== id) : [...prev, id]
    );
  };

  const rawTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 折扣計算邏輯
  const applicableCoupon = INITIAL_COUPONS
    .filter(c => claimedCoupons.includes(c.id) && rawTotal >= c.minSpend)
    .sort((a, b) => b.discount - a.discount)[0];

  const discountAmount = applicableCoupon ? applicableCoupon.discount : 0;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const claimCoupon = (id: string) => {
    if (!claimedCoupons.includes(id)) {
      setClaimedCoupons([...claimedCoupons, id]);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    // 模擬驗證行為
    setTimeout(() => {
      if (isRegisterMode) {
        setUser({ name: loginForm.name || '新會員', email: loginForm.email });
      } else {
        setUser({ name: loginForm.email.split('@')[0], email: loginForm.email });
      }
      setIsSubmitting(false);
      setIsLoginModalOpen(false);
      setLoginForm({ email: '', password: '', name: '' });
    }, 1000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setIsCartOpen(false);
      setIsLoginModalOpen(true);
      return;
    }
    setIsSubmitting(true);
    // 模擬 GAS google.script.run
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => {
        setOrderSuccess(false);
        setIsCartOpen(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* 導航欄 */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
              <span className="font-bold text-xl tracking-tight">GAS CLOSET</span>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="flex items-center">
                <AnimatePresence>
                  {isSearchVisible && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 180, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      type="text"
                      placeholder="搜尋商品..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-100 border-none rounded-full px-4 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none mr-1"
                      autoFocus
                    />
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => {
                    setIsSearchVisible(!isSearchVisible);
                    if (isSearchVisible) setSearchQuery('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition"
                >
                  {isSearchVisible ? <X className="w-5 h-5 text-slate-600" /> : <Search className="w-5 h-5 text-slate-400 hover:text-indigo-600 transition" />}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => {/* 收藏夾彈窗 */}}>
                  <Heart className={`w-6 h-6 transition ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-400 group-hover:text-rose-500'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                      {wishlist.length}
                    </span>
                  )}
                </div>
                
                <div className="relative cursor-pointer group" onClick={() => setIsCartOpen(true)}>
                  <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transition" />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in border-2 border-white">
                      {cart.reduce((a, b) => a + b.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 rounded-full transition" onClick={() => user ? setUser(null) : setIsLoginModalOpen(true)}>
                <User className={`w-5 h-5 transition ${user ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                {user && <span className="text-xs font-bold text-slate-700 hidden lg:block">Hi, {user.name}</span>}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 分類切換 */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {/* ...原本的分類按鈕... */}
            <button 
              onClick={() => setActiveTab('summer-women')}
              className={`py-4 text-xs sm:text-sm font-medium transition-all relative flex-shrink-0 ${
                activeTab === 'summer-women' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >夏季女生{activeTab === 'summer-women' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}</button>
            <button 
              onClick={() => setActiveTab('summer-men')}
              className={`py-4 text-xs sm:text-sm font-medium transition-all relative flex-shrink-0 ${
                activeTab === 'summer-men' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >夏季男生{activeTab === 'summer-men' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}</button>
            <button 
              onClick={() => setActiveTab('winter-women')}
              className={`py-4 text-xs sm:text-sm font-medium transition-all relative flex-shrink-0 ${
                activeTab === 'winter-women' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >冬季女生{activeTab === 'winter-women' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}</button>
            <button 
              onClick={() => setActiveTab('winter-men')}
              className={`py-4 text-xs sm:text-sm font-medium transition-all relative flex-shrink-0 ${
                activeTab === 'winter-men' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >冬季男生{activeTab === 'winter-men' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}</button>
          </div>
        </div>
      </div>

      {/* 標籤過濾器 */}
      <div className="bg-slate-50 py-3 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2">
          {['全部', '熱銷', '新品', '精品', '優惠', '推薦'].map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTagFilter(tag === '全部' ? null : tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
                (activeTagFilter === tag || (tag === '全部' && !activeTagFilter))
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 優惠券領取橫幅 */}
      <div className="bg-indigo-600">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">開站大酬賓！限時領取全店折價券，最高可折 $300</span>
          </div>
          <button 
            onClick={() => setIsCouponModalOpen(true)}
            className="flex-shrink-0 ml-4 px-3 py-1 bg-white text-indigo-600 text-xs sm:text-sm font-bold rounded-full hover:bg-slate-100 transition shadow-sm"
          >
            立即領取
          </button>
        </div>
      </div>

      {/* 商品列表 */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900 capitalize">
            {searchQuery.trim() !== '' ? `搜尋結果: "${searchQuery}"` : activeTab.replace('-', ' ')}
          </h2>
          <p className="text-slate-500 mt-1">
            {searchQuery.trim() !== '' ? `找到 ${filteredProducts.length} 件相關商品` : '探索本季最新流行趨勢'}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                  wishlist={wishlist}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  onProductClick={setSelectedProduct}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">找不到符合的商品</h3>
                <p className="text-slate-500">試試看其他的關鍵字，或是切換分類看看？</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProduct(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
              >
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-indigo-600 transition md:text-slate-400 md:hover:bg-slate-100 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
                  <ProductImage src={selectedProduct.img} alt={selectedProduct.name} className="w-full h-full" />
                </div>
                <div className="p-8 md:w-1/2 flex flex-col overflow-y-auto no-scrollbar">
                  <span className="text-indigo-600 text-sm font-black tracking-widest uppercase mb-2">{selectedProduct.tag}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-4">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-3xl font-black text-indigo-600">${selectedProduct.price.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full">有存貨</span>
                  </div>
                  <div className="space-y-6 flex-1">
                    <div className="space-y-2">
                      <h4 className="font-bold text-slate-800">商品細節</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        本商品採用高品質面料，專為季節感穿搭設計。注重每一處縫線的工藝，確保舒適度與美型剪裁。是本季不可錯過的單品。
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">材質</span>
                        <span className="text-xs font-black text-slate-700">精選棉質 / 纖維</span>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">系列</span>
                        <span className="text-xs font-black text-slate-700 uppercase">{selectedProduct.season} COLLECTION</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 pt-8 border-t border-slate-100 flex gap-4">
                    <button 
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                    >
                      加入購物車
                    </button>
                    <button 
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`p-4 rounded-2xl border-2 transition ${
                        wishlist.includes(selectedProduct.id) ? 'bg-rose-50 border-rose-100 text-rose-500 shadow-inner' : 'border-slate-100 text-slate-300 hover:text-rose-500 hover:border-rose-100'
                      }`}
                    >
                      <Heart className={`w-6 h-6 ${wishlist.includes(selectedProduct.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLoginModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900">{isRegisterMode ? '加入 GAS 會員' : '歡迎回來'}</h3>
                    <p className="text-slate-500 mt-2">{isRegisterMode ? '立即註冊，享受專屬優惠' : '登入帳號以繼續購物'}</p>
                  </div>
                  
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {isRegisterMode && (
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 px-1">中文姓名</label>
                        <input 
                          required 
                          type="text" 
                          value={loginForm.name}
                          onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                          placeholder="王小明" 
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 px-1">電子郵件</label>
                      <input 
                        required 
                        type="email" 
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                        placeholder="example@mail.com" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-slate-700 px-1">密碼</label>
                      <input 
                        required 
                        type="password" 
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                        placeholder="••••••••" 
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 mt-4 disabled:opacity-50"
                    >
                      {isSubmitting ? '處理中...' : (isRegisterMode ? '註冊會員' : '登入')}
                    </button>
                  </form>
                  
                  <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                      {isRegisterMode ? '已經有帳號了？' : '還沒有帳號嗎？'}
                      <button 
                        onClick={() => setIsRegisterMode(!isRegisterMode)}
                        className="ml-2 text-indigo-600 font-bold hover:underline"
                      >
                        {isRegisterMode ? '立即登入' : '免費註冊'}
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* 側邊購物車 */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">購物車 ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col no-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">購物車是空的，快去選購吧！</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 animate-in slide-in-from-right">
                      <div className="w-20 h-24 flex-shrink-0 cursor-pointer" onClick={() => setSelectedProduct(item)}>
                        <ProductImage src={item.img} alt={item.name} className="w-full h-full rounded-xl shadow-sm hover:opacity-85 transition" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-rose-50 rounded-lg transition group">
                            <X className="w-3.5 h-3.5 text-slate-300 group-hover:text-rose-500" />
                          </button>
                        </div>
                        <p className="text-indigo-600 font-black mt-1 text-sm">${item.price.toLocaleString()}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                            <button onClick={() => updateCartQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition text-slate-500 font-bold">-</button>
                            <span className="w-8 text-center text-xs font-black text-slate-800">{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition text-slate-500 font-bold">+</button>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">小計: ${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="text-sm">商品小計</span>
                      <span className="font-medium">${rawTotal.toLocaleString()}</span>
                    </div>
                    {applicableCoupon && (
                      <div className="flex justify-between items-center text-indigo-600">
                        <span className="text-sm font-medium flex items-center gap-1">折扣 ({applicableCoupon.id})</span>
                        <span className="font-bold">-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                      <span className="font-bold text-slate-800">總計金額</span>
                      <span className="text-2xl font-black text-indigo-600">${finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {orderSuccess ? (
                    <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center justify-center gap-2 font-medium animate-in zoom-in">
                      <CheckCircle2 className="w-5 h-5" />
                      訂單已成功送出！
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitOrder} className="space-y-4">
                      {!user && (
                        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 mb-2">
                          請先登入會員以繼續結帳
                        </p>
                      )}
                      <input required defaultValue={user?.name || ''} placeholder="收件人姓名" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                      <input required type="tel" placeholder="聯絡電話" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                      <button 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg shadow-indigo-200"
                      >
                        {isSubmitting ? '處理中...' : (user ? '確認結帳' : '登入並結帳')}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
