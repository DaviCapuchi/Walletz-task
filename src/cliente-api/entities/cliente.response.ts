export interface ApiResponse<T>{
    sucesso:boolean;
    mensagem:string;
    data:T;
}

// Conceito disso esta muito dificil de entender para min
// Por que data "T"? Não faz sentido, quero morrer
// Pra que se usa isso?