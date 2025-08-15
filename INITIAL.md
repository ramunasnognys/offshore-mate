Got it! So you already have the shareable link and calendar generation done. You just need to implement the actual sharing mechanism for email and WhatsApp. Let me create a focused prompt for that:

---

## **Prompt: Implement Email and WhatsApp Sharing Integration for Existing Calendar Share Links**

### **Overview**
Add email and WhatsApp sharing capabilities to an existing web application that already generates shareable calendar links. The calendar and date range are already configured by the user, and the shareable link already exists.

### **Given Context**
- Shareable links are already generated (e.g., `https://yourapp.com/shared/calendar/{shareToken}`)
- Calendar data and date range are already set by the sharing user
- Need to implement convenient one-click sharing via email and WhatsApp

### **Core Requirements**

#### **1. User Interface Updates**
Add sharing buttons/options to your existing share interface:
```html
- WhatsApp share button (with WhatsApp icon)
- Email share button (with email icon)  
- Copy link button (as fallback option)
- Optional: Share preview text area (customizable message)
```

#### **2. WhatsApp Integration**
Implement direct WhatsApp sharing with pre-filled message:

```javascript
function shareViaWhatsApp(shareLink, calendarDetails) {
  // Create preview message
  const message = `📅 I'm sharing my calendar with you!
  
Period: ${calendarDetails.dateRange}
View my calendar: ${shareLink}`;
  
  // Use WhatsApp API (works for both mobile and WhatsApp Web)
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  // For mobile detection and app-specific URL
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const url = isMobile 
    ? `whatsapp://send?text=${encodeURIComponent(message)}`
    : whatsappUrl;
  
  window.open(url, '_blank');
}
```

#### **3. Email Integration**
Implement email sharing with pre-filled content:

```javascript
function shareViaEmail(shareLink, calendarDetails) {
  const subject = `Calendar Share: ${calendarDetails.dateRange}`;
  
  const body = `Hi,

I'm sharing my calendar with you for the period: ${calendarDetails.dateRange}

Click here to view my calendar:
${shareLink}

This is a read-only view of my calendar during the selected period.

Best regards`;

  // Create mailto link
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;
}
```

#### **4. Enhanced Share Modal Component**
Create or update your share modal to include:

```javascript
// Share modal with preview and multiple share options
const ShareModal = ({ shareLink, calendarInfo }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  // Generate preview text
  const getSharePreview = () => {
    return `Check out my calendar for ${calendarInfo.dateRange}`;
  };
  
  // Copy to clipboard function
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  return (
    <div className="share-modal">
      {/* Preview Section */}
      <div className="share-preview">
        <h3>Share Preview</h3>
        <div className="preview-box">
          <p>{getSharePreview()}</p>
          <input 
            type="text" 
            value={shareLink} 
            readOnly 
            className="share-link-input"
          />
        </div>
      </div>
      
      {/* Share Options */}
      <div className="share-options">
        <button onClick={() => shareViaWhatsApp(shareLink, calendarInfo)}>
          <i className="fab fa-whatsapp"></i> Share on WhatsApp
        </button>
        
        <button onClick={() => shareViaEmail(shareLink, calendarInfo)}>
          <i className="fas fa-envelope"></i> Share via Email
        </button>
        
        <button onClick={copyToClipboard}>
          <i className="fas fa-copy"></i> 
          {copySuccess ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};
```

#### **5. Web Share API Implementation (Progressive Enhancement)**
For browsers that support the Web Share API, provide native sharing:

```javascript
async function nativeShare(shareLink, calendarDetails) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My Calendar',
        text: `View my calendar for ${calendarDetails.dateRange}`,
        url: shareLink
      });
    } catch (err) {
      // Fallback to manual sharing options
      console.log('Native share cancelled or failed');
    }
  } else {
    // Show manual share options (WhatsApp, Email, Copy)
    showShareModal();
  }
}
```

#### **6. Mobile Responsiveness**
Ensure sharing works seamlessly across devices:
- Detect mobile vs desktop for appropriate WhatsApp URL
- Use responsive design for share buttons
- Consider touch-friendly button sizes on mobile
- Test on various browsers and devices

#### **7. Implementation Steps**

1. **Add share buttons** to your existing share interface
2. **Implement JavaScript functions** for WhatsApp and email sharing
3. **Add preview section** showing what will be shared
4. **Include copy-to-clipboard** as fallback option
5. **Test across platforms** (mobile/desktop, different browsers)
6. **Add loading states** and success feedback
7. **Handle errors gracefully** (e.g., if WhatsApp isn't installed)

#### **8. Success Criteria**
- One-click sharing to WhatsApp opens WhatsApp with pre-filled message
- One-click email sharing opens email client with pre-filled content
- Copy link function works with visual feedback
- All sharing methods work on mobile and desktop
- Share preview accurately shows what will be sent

#### **9. Optional Enhancements**
- Add more sharing options (SMS, Telegram, Slack)
- Allow users to customize the share message
- Track which sharing method is used (analytics)
- Generate a preview image/thumbnail of the calendar
- Add QR code generation for easy mobile sharing

---

**Is this more aligned with what you need? Would you like me to focus on any specific aspect of the sharing integration?**