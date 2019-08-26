package com.java.activiti.server;

import java.io.IOException;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.log4j.Logger;

import com.java.activiti.util.WebSocketMapUtil;

import net.sf.json.JSONObject;

//@ServerEndpoint(value = "/websocket")
public class MyWebSocketServer {

	private Logger logger = Logger.getLogger(MyWebSocketServer.class);
	private Session session;

	/**
	 * ���ӽ����󴥷��ķ���
	 */
	@OnOpen
	public void onOpen(Session session) {
		this.session = session;
		logger.info("onOpen" + session.getId());
		WebSocketMapUtil.put(session.getId(), this);
	}

	/**
	 * ���ӹرպ󴥷��ķ���
	 */
	@OnClose
	public void onClose() {
		// ��map��ɾ��
		WebSocketMapUtil.remove(session.getId());
		logger.info("====== onClose:" + session.getId() + " ======");
	}

	/**
	 * ���յ��ͻ�����Ϣʱ�����ķ���
	 */
	@OnMessage
	public void onMessage(String params, Session session) throws Exception {
		// ��ȡ����˵��ͻ��˵�ͨ��
		MyWebSocketServer myWebSocket = WebSocketMapUtil.get(session.getId());
		logger.info("�յ�����" + session.getId() + "����Ϣ" + params);
		String result = "�յ�����" + session.getId() + "����Ϣ" + params;
		// ������Ϣ��Web Socket�ͻ��ˣ��������
		myWebSocket.sendMessage(1, "�ɹ�", result);
	}

	/**
	 * ��������ʱ�����ķ���
	 */
	@OnError
	public void onError(Session session, Throwable error) {
		logger.info(session.getId() + "���ӷ�������" + error.getMessage());
	}

	public void sendMessage(int status, String message, Object datas) throws IOException {
		JSONObject result = new JSONObject();
		result.put("status", status);
		result.put("message", message);
		result.put("datas", datas);
		this.session.getBasicRemote().sendText(result.toString());
	}
}
