import { Transform } from 'stream';
import { apiChat } from '../api/apiChat';
import { Request, Response } from 'express';

export const sendQuestionService = async (bodyValue: any, res: Response) => {
  var resposta:any = null
  try {
    // Fazendo a requisição ao serviço de chat (Ollama)
    const apiResponse = await apiChat.post(
      '/chat',  
      bodyValue,
      { responseType: 'stream' }  
    );

    // Configura os cabeçalhos da resposta para o cliente 
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');  // Streaming de dados em pedaços

    // Vamos usar o LogStream para capturar e logar os dados enquanto os transmitimos
    const logStream = new Transform({
      transform(chunk: any, encoding: string, callback: Function) {
        // Loga o "chunk" de dados enquanto está sendo recebido
        var respostaJson = JSON.parse(chunk)
        respostaJson = respostaJson.message.content || ""
        resposta += respostaJson
        console.log(resposta);
        // Passa o dado para o próximo fluxo
        callback(null, chunk);
      }
    });

    // Usamos o pipe para passar os dados do stream do Ollama para o LogStream, que vai logar e depois passar para a resposta
    apiResponse.data.pipe(logStream).pipe(res);  // Aqui estamos transmitindo e logando ao mesmo tempo

  } catch (error) {
    // Loga o erro caso algo aconteça durante a requisição
    console.error('Erro ao processar a requisição:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};
