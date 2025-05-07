
@echo off
echo ===================================
echo Carol Artes - Script de Build
echo ===================================

echo.
echo [1/6] Instalando dependencias...
call npm install

echo.
echo [2/6] Limpando pasta dist...
if exist dist rmdir /s /q dist
mkdir dist

echo.
echo [3/6] Executando build...
call npm run build

echo.
echo [4/6] Copiando favicon...
if exist public\favicon.ico copy public\favicon.ico dist\
if not exist public\favicon.ico echo AVISO: Favicon nao encontrado!

echo.
echo [5/6] Verificando build...
if not exist dist\index.html (
    echo ERRO: Build falhou, index.html nao foi gerado!
    exit /b 1
)

echo.
echo [6/6] Iniciando preview do build...
echo Pressione Ctrl+C para encerrar o servidor de preview
echo Acesse: http://localhost:5000
echo.
call npm run preview

echo.
echo Build concluido com sucesso!
