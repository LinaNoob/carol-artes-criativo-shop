
#!/usr/bin/env python3
import os
import shutil
import subprocess
import sys
import platform

# Função para executar comandos com feedback visual
def execute_command(command, description):
    print(f"\n{description}...")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"ERRO: Falha ao executar: {command}")
        sys.exit(1)
    return result

# Cabeçalho
print("===================================")
print("Carol Artes - Script de Build")
print("===================================")

# 1. Instalar dependências
execute_command("npm install", "[1/6] Instalando dependências")

# 2. Limpar pasta dist
print("\n[2/6] Limpando pasta dist...")
if os.path.exists("dist"):
    shutil.rmtree("dist")
os.makedirs("dist", exist_ok=True)

# 3. Executar build
execute_command("npm run build", "[3/6] Executando build")

# 4. Copiar favicon
print("\n[4/6] Copiando favicon...")
if os.path.exists("public/favicon.ico"):
    shutil.copy("public/favicon.ico", "dist/")
else:
    print("AVISO: Favicon não encontrado!")

# 5. Verificar build
print("\n[5/6] Verificando build...")
if not os.path.exists("dist/index.html"):
    print("ERRO: Build falhou, index.html não foi gerado!")
    sys.exit(1)

# 6. Iniciar preview
print("\n[6/6] Iniciando preview do build...")
print("Pressione Ctrl+C para encerrar o servidor de preview")
print("Acesse: http://localhost:5000\n")

# Iniciar preview
execute_command("npm run preview", "Servidor de preview")

print("\nBuild concluído com sucesso!")
