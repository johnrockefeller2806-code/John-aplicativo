# STUFF Intercâmbio - Mobile App

Aplicação móvel nativa para iOS e Android do STUFF Intercâmbio.

## 🚀 Tecnologias

- **React Native** com **Expo SDK 54**
- **TypeScript**
- **Expo Router** para navegação
- **NativeWind** (Tailwind para React Native)
- **Expo Secure Store** para armazenamento seguro
- **Expo Local Authentication** para biometria

## 🎨 Tema da Irlanda

O app utiliza a identidade visual irlandesa:
- 🍀 Vetores de trevo (Shamrock)
- 🎵 Harpa irlandesa
- 🇮🇪 Cores da bandeira (verde, branco, laranja)
- 🏙️ Skyline de Dublin

## 📱 Funcionalidades

- ✅ Login com PIN de 6 dígitos
- ✅ Autenticação biométrica (Face ID / Touch ID)
- ✅ Catálogo de escolas
- ✅ Informações de transporte
- ✅ Guias de documentos
- ✅ Comunidade/Chat
- ✅ Perfil do usuário

## 🛠️ Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
EXPO_PUBLIC_API_URL=https://sua-api.com/api
```

### 3. Executar em desenvolvimento

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📦 Build para produção

### Android (APK/AAB)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
eas login

# Build para Android
eas build --platform android
```

### iOS (IPA)

```bash
# Build para iOS (requer conta Apple Developer)
eas build --platform ios
```

## 📲 Publicar nas lojas

### Google Play Store

1. Criar conta no [Google Play Console](https://play.google.com/console) (€25)
2. Criar novo aplicativo
3. Fazer upload do arquivo `.aab`
4. Preencher informações da loja
5. Enviar para revisão

### Apple App Store

1. Criar conta no [Apple Developer Program](https://developer.apple.com) (€99/ano)
2. Criar App ID no portal
3. Usar EAS para enviar build
4. Configurar no App Store Connect
5. Enviar para revisão

## 📁 Estrutura de pastas

```
stuff-mobile/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── screens/        # Telas do app
│   ├── context/        # Context API (Auth, Language)
│   ├── services/       # APIs e serviços
│   ├── hooks/          # Custom hooks
│   ├── theme/          # Cores, tipografia, espaçamentos
│   └── assets/         # Imagens e fontes
├── App.tsx            # Componente principal
├── app.json           # Configuração do Expo
└── package.json       # Dependências
```

## 📞 Suporte

Dúvidas? Entre em contato:
- Email: suporte@stuffintercambio.com
- WhatsApp: +353 XX XXX XXXX
