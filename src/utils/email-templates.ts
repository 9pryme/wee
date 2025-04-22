/**
 * Renders a template with provided variables
 */
export function renderTemplate(template: string, variables: Record<string, string>): string {
  let renderedTemplate = template
  
  // Replace all variables in the template
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    renderedTemplate = renderedTemplate.replace(regex, value)
  })
  
  return renderedTemplate
}

/**
 * Creates a bank petition email template
 */
export function createBankPetitionTemplate(data: {
  bankName: string,
  petitionerName: string,
  petitionerEmail: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Petition Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
        }
        .header {
          background-color: #2ECEB0;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .highlight {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Petition Submission</h1>
        </div>
        <div class="content">
          <p>Dear ${data.bankName} Team,</p>
          <p>A new petition has been submitted requesting more funding for women entrepreneurs.</p>
          
          <div class="highlight">
            <p><strong>Petitioner:</strong> ${data.petitionerName}</p>
            <p><strong>Email:</strong> ${data.petitionerEmail}</p>
          </div>
          
          <h3>Petition Demands:</h3>
          <ol>
            <li>Increase funding allocation for women-led businesses</li>
            <li>Create specialized loan products for women entrepreneurs</li>
            <li>Simplify application processes for women-owned businesses</li>
            <li>Provide mentorship and support programs alongside funding</li>
          </ol>
          
          <p>This petition is part of the WeeWantMore campaign to improve access to finance for women entrepreneurs in Nigeria.</p>
          <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
        </div>
        <div class="footer">
          <p>© 2024 WeeWantMore. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Creates a confirmation email template
 */
export function createConfirmationTemplate(data: {
  petitionerName: string,
  bankName: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Petition</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          padding: 20px;
        }
        .header {
          background-color: #2ECEB0;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .highlight {
          background-color: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .button {
          background-color: #ED323D;
          color: white;
          padding: 10px 15px;
          text-decoration: none;
          border-radius: 5px;
          display: inline-block;
        }
        .social-links {
          margin-top: 20px;
          text-align: center;
        }
        .social-links a {
          margin: 0 10px;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Petition</h1>
        </div>
        <div class="content">
          <p>Dear ${data.petitionerName},</p>
          <p>Thank you for signing the petition to request more funding for women entrepreneurs from ${data.bankName}.</p>
          <p>Your voice matters, and together we can make a difference in improving access to finance for women-led businesses in Nigeria.</p>
          
          <div class="highlight">
            <p>Your petition has been sent to ${data.bankName}.</p>
          </div>
          
          <p>Share this petition with others to amplify our message:</p>
          <p style="text-align: center;">
            <a href="https://weewantmore.ng/petition" class="button">Share the Petition</a>
          </p>
          
          <div class="social-links">
            <a href="https://twitter.com/intent/tweet?text=I just signed a petition to make banks fund women entrepreneurs! Join me and make your voice heard!&url=https://weewantmore.ng/petition">
              Twitter
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=https://weewantmore.ng/petition">
              Facebook
            </a>
            <a href="https://wa.me/?text=I just signed a petition to make banks fund women entrepreneurs! Join me and make your voice heard! https://weewantmore.ng/petition">
              WhatsApp
            </a>
          </div>
          
          <p>For more information, please visit <a href="https://weewantmore.ng">weewantmore.ng</a>.</p>
        </div>
        <div class="footer">
          <p>© 2024 WeeWantMore. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
} 