package com.java.activiti.client;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.log4j.Logger;
import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;

public class MyWebSocketClient extends WebSocketClient {

	
	Logger logger = Logger.getLogger(MyWebSocketClient.class);

	public MyWebSocketClient(URI serverUri) {
		super(serverUri);
	}

	@Override
	public void onOpen(ServerHandshake arg0) {
		logger.info("------ MyWebSocket onOpen ------");
	}

	@Override
	public void onClose(int arg0, String arg1, boolean arg2) {
		logger.info("------ MyWebSocket onClose ------");
	}

	@Override
	public void onError(Exception arg0) {
		logger.info("------ MyWebSocket onError ------");
	}

	@Override
	public void onMessage(String arg0) {
		logger.info("-------- ���յ���������ݣ� " + arg0 + "--------");
	}

	public static void main(String[] arg0) throws URISyntaxException {
		MyWebSocketClient myClient = new MyWebSocketClient(new URI("ws://localhost/activiti5.20/websocket"));
		// ��websocket����˷�������
		myClient.send("��ΪҪ���͵���������");
		
	}
}
