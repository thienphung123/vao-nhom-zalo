// File: api/index.js

export default function handler(req, res) {
    // 1. Cấu hình Link Zalo gốc của bạn ở đây
    const ZALO_LINK_GOC = "https://zalo.me/g/beoftc917"; 

    // 2. Lấy thông tin User-Agent (Để xem là Người hay Bot)
    const userAgent = req.headers['user-agent'] || '';
    
    // 3. Logic Check Bot (Giống hệt đoạn PHP của bác Huy)
    // Check xem có phải bot Facebook không
    const isFbBot = userAgent.includes('facebookexternalhit') || 
                    userAgent.includes('Facebot') || 
                    userAgent.includes('facebook.com');

    // 4. XỬ LÝ
    if (isFbBot) {
        // === NẾU LÀ BOT FACEBOOK ===
        // Trả về nội dung vô hại để Bot không quét ra link Zalo
        // Status 200 OK đánh lừa bot là trang web bình thường
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Tin tức 24h</title>
                <meta property="og:title" content="Chia sẻ tài liệu miễn phí" />
                <meta property="og:description" content="Bấm để xem chi tiết..." />
            </head>
            <body>
                <h1>Đang tải dữ liệu...</h1>
            </body>
            </html>
        `);
    } else {
        // === NẾU LÀ NGƯỜI DÙNG THẬT ===
        // Trả về trang HTML có Script tự động mở App Zalo (Deep Link)
        // Lưu ý: Không dùng Redirect 301 (res.redirect) vì sẽ bị lỗi trắng trang trên iPhone
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Đang vào nhóm Zalo...</title>
                <style>
                    body { font-family: -apple-system, sans-serif; text-align: center; padding-top: 50px; background: #f0f2f5; }
                    .btn { background: #0068ff; color: white; padding: 15px 30px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 18px; }
                </style>
            </head>
            <body>
                <p>Đang mở Zalo...</p>
                <br>
                <a href="${ZALO_LINK_GOC}" class="btn">BẤM VÀO ĐÂY NẾU KHÔNG TỰ MỞ</a>
                
                <script>
                    // Logic tự động chuyển hướng
                    setTimeout(function() {
                        window.location.href = "${ZALO_LINK_GOC}";
                    }, 500); // Đợi 0.5s rồi chuyển
                </script>
            </body>
            </html>
        `);
    }
}