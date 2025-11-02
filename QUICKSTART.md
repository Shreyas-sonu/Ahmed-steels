# 🚀 Quick Start Guide - Ahmed Steels & Cement Website

Follow these steps to get the website up and running in under 5 minutes!

## Step 1: Install Dependencies ⚡

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages. Takes about 2-3 minutes.

## Step 2: Add Images 🖼️

1. Download images from: https://share.google/6OH7djrzfGq595HVH

2. Add images to these folders:
   - `public/images/hero-bg.jpg` - Main hero background
   - `public/images/products/` - All 12 product images
   - `public/images/gallery/` - All 8 gallery images

**Tip**: Check the README files in each image folder for the exact filenames needed.

## Step 3: Configure Email (Optional) 📧

If you want email notifications for enquiries:

1. Copy `.env.local.example` to `.env.local`:
```powershell
Copy-Item .env.local.example .env.local
```

2. Edit `.env.local` and add Gmail App Password:
```env
EMAIL_USER=mohammedtahirsteel@gmail.com
EMAIL_PASS=your_16_character_app_password
```

**Getting Gmail App Password**:
- Enable 2FA on Google Account
- Go to: https://myaccount.google.com/apppasswords
- Create app password for "Mail"
- Copy the 16-character password

## Step 4: Run Development Server 🎯

```powershell
npm run dev
```

Open browser to: **http://localhost:3000**

## Step 5: Test Everything ✅

1. ✅ Check all sections load correctly
2. ✅ Test navigation menu
3. ✅ Try the enquiry form
4. ✅ Verify WhatsApp redirect works
5. ✅ Check email notification (if configured)

## Production Build 🏗️

When ready to deploy:

```powershell
npm run build
npm run start
```

## Deploy to Vercel 🚀

1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

## Need Help? 🆘

- Check the main README.md for detailed documentation
- Contact: mohammedtahirsteel@gmail.com
- Phone: +91 9972394416

---

**That's it! Your website is ready! 🎉**
