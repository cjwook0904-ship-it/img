import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// ---------------------------------------------------------------------------
// 🔑 API KEY 설정 (API KEY CONFIGURATION)
// .env 파일을 만들기 어렵다면, 아래 따옴표 안에 본인의 API Key를 직접 붙여넣으세요.
// 예시: const MANUALLY_SET_KEY = "AIzaSyDxxxxxxxxxxxxxxx";
const MANUALLY_SET_KEY: string = "AIzaSyCu-F7Ikf75pWK8-rw8Iqu5C5g7UBj_rp8"; 
// ---------------------------------------------------------------------------

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 모드에 맞는 env 파일을 로드합니다.
  // 접두사 없이 모든 환경 변수를 로드하기 위해 세 번째 인자를 ''로 설정합니다.
  const env = loadEnv(mode, process.cwd(), '');

  // 코드에 수동으로 키가 설정되어 있다면, 환경 변수보다 우선하여 사용합니다.
  if (MANUALLY_SET_KEY && MANUALLY_SET_KEY.length > 0) {
    env.API_KEY = MANUALLY_SET_KEY;
  }

  return {
    plugins: [react()],
    define: {
      // process.env 객체를 브라우저 환경에서 사용할 수 있도록 주입합니다.
      'process.env': env
    }
  }
})