@echo off
echo Setting NEXTAUTH_URL for correct port...
set NEXTAUTH_URL=http://localhost:3002
echo NEXTAUTH_URL is now: %NEXTAUTH_URL%
echo.
echo Starting development server with correct configuration...
npm run dev
