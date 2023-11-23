declare global {

   namespace NodeJS {

      interface ProcessEnv {

         token: string;
         guild: string;
         db: string;

      }

   }

}

export {}