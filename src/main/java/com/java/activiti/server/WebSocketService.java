package com.java.activiti.server;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;
import javax.websocket.EncodeException;
import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import org.apache.commons.collections.CollectionUtils;

import com.java.activiti.model.MemberShip;
import com.java.activiti.model.OnlineUser;
import com.java.activiti.util.JsonConfigUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

@ServerEndpoint(value = "/websocket/{info}", configurator = HttpSessionConfigurator.class)
public class WebSocketService {

	private static SimpleDateFormat df = new SimpleDateFormat("HH:mm:ss");// 创建时间格式对象
	// concurrent包的线程安全Set，用来存放每个客户端对应的WebSocketService对象。
	private static ConcurrentHashMap<String, ConcurrentHashMap<String, WebSocketService>> roomList = new ConcurrentHashMap<String, ConcurrentHashMap<String, WebSocketService>>();
	// 静态初始化
	static {
		roomList.put("room1", new ConcurrentHashMap<String, WebSocketService>());
	}
	private static int onlineCount = 0; // 记录连接数目
	// Map<用户id，用户信息>
	private static Map<String, OnlineUser> onlineUserMap = new ConcurrentHashMap<String, OnlineUser>(); // 在线用户
	// 与某个客户端的连接会话，需要通过它来给客户端发送数据
	private Session session;

	// 获取roomList列表
	public static ConcurrentHashMap<String, ConcurrentHashMap<String, WebSocketService>> getRoomList() {
		return roomList;
	}

	/**
	 * 用户接入
	 * 
	 * @param session
	 * @throws EncodeException
	 * @throws IOException
	 */
	@OnOpen
	public void onOpen(@PathParam(value = "info") String info, Session session) throws IOException, EncodeException {
		this.session = session;
		String roomId = info.split("[|]")[0]; // 房间名
		String userId = info.split("[|]")[1]; // 获取用户名

		addOnlineCount();

		OnlineUser onlineUser = new OnlineUser(userId, session);
		onlineUserMap.put(userId, onlineUser);// 加入房间

		JSONObject msg = new JSONObject();

		// 通知所有在线用户，当前用户上线
		String content = "[" + df.format(new Date()) + " : " + userId + "加入聊天室，当前在线人数为 " + getOnlineCount() + "位" + "]";// 登录通知
		msg.put("flag", "join");
		msg.put("roomId", roomId);
		msg.put("userId", userId);
		msg.put("number", getOnlineCount());
		msg.put("content", content);
		this.getUserList(msg, onlineUserMap.values());
		this.broadcast(msg.toString(), onlineUserMap.values());
	}

	/**
	 * 实时获取用户列表
	 * 
	 * @param msg
	 *            消息
	 * @param onlineUsers
	 *            在线用户
	 */
	public void getUserList(JSONObject msg, Collection<OnlineUser> onlineUsers) {
		if (CollectionUtils.isNotEmpty(onlineUsers)) {
			List<String> propertys = new ArrayList<String>();
			propertys.add("session");
			JSONArray userListArray = JSONArray.fromObject(onlineUsers, JsonConfigUtils.getJsonConfig(propertys));
			msg.put("userList", userListArray);
		}
	}

	/**
	 * 广播消息
	 * 
	 * @param message
	 *            消息
	 * @param onlineUsers
	 *            在线用户
	 */
	public void broadcast(String message, Collection<OnlineUser> onlineUsers) {
		/*************************** 在线用户 ***************************/
		StringBuffer userStr = new StringBuffer();
		for (OnlineUser user : onlineUsers) {
			userStr.append(user.getUserid() + ",");
		}
		if (onlineUsers.size() > 1) {
			userStr.deleteCharAt(userStr.length() - 1);
		}
		/*************************** 在线用户 ***************************/
		for (OnlineUser user : onlineUsers) {
			try {
				user.getSession().getBasicRemote().sendText(message);
			} catch (IOException e) {
				e.printStackTrace();
				continue;
			}
		}
	}

	public void sendMessage(String message) throws IOException {
		this.session.getBasicRemote().sendText(message);
	}

	/**
	 * 接收到来自用户的消息
	 * 
	 * @param message
	 * @param session
	 * @throws IOException
	 */
	@OnMessage
	public void onMessage(String message, Session session) throws IOException {
		// 把用户发来的消息解析为JSON对象
		JSONObject obj = JSONObject.fromObject(message);
		if (obj.get("flag").toString().equals("exitroom")) { // 退出房间操作
			String userId = obj.get("nickname").toString();
			obj.put("flag", "exitroom");
			subOnlienCount();
			onlineUserMap.remove(userId);// 移除房间
			String content = "[" + df.format(new Date()) + " : " + userId + "退出聊天室，当前在线人数为 " + getOnlineCount() + "位"
					+ "]";// 登录通知
			obj.put("content", content);
			obj.put("number", getOnlineCount());
			this.getUserList(obj, onlineUserMap.values());
			this.broadcast(obj.toString(), onlineUserMap.values());
		} else if (obj.get("flag").toString().equals("chatroom")) { // 聊天室的消息
			// 向JSON对象中添加发送时间
			obj.put("date", df.format(new Date()));
			// 获取客户端发送的数据中的内容---房间�? 用于区别该消息是来自于哪个房间
			// String roomid = obj.get("target").toString();
			// 获取客户端发送的数据中的内容---用户
			String userId = obj.get("nickname").toString();
			// 从房间列表中定位到该房间
			this.getUserList(obj, onlineUserMap.values());
			obj.put("number", getOnlineCount());
			StringBuffer userStr = new StringBuffer();
			for (OnlineUser user : onlineUserMap.values()) {
				userStr.append(user.getUserid() + ",");
			}
			userStr.deleteCharAt(userStr.length() - 1);
			/*************************** 在线用户 ***************************/
			for (OnlineUser user : onlineUserMap.values()) {
				try {
					if (user.getUserid().equals(userId)) {
						obj.put("isSelf", true);// 设置消息是否为自己的
					} else {
						obj.put("isSelf", false);// 设置消息是否为自己的
					}
					user.getSession().getBasicRemote().sendText(obj.toString());
				} catch (IOException e) {
					e.printStackTrace();
					continue;
				}
			}
		}
	}

	/**
	 * 用户断开
	 * 
	 * @param session
	 */
	@OnClose
	public void onClose(@PathParam("info") String info, Session session) {
		String userId = info.split("[|]")[1]; // 获取用户名
		JSONObject obj = new JSONObject();
		obj.put("flag", "close");
		subOnlienCount();
		obj.put("number", getOnlineCount());
		onlineUserMap.remove(userId);// 移除房间
		String content = "[" + df.format(new Date()) + " : " + userId + "断开链接，当前在线人数为 " + getOnlineCount() + "位" + "]";// 登录通知
		obj.put("content", content);
		this.getUserList(obj, onlineUserMap.values());
		this.broadcast(obj.toString(), onlineUserMap.values());
	}

	/**
	 * 用户连接异常
	 * 
	 * @param t
	 */
	@OnError
	public void onError(Throwable t) {

	}

	public static int getOnlineCount() {
		return onlineCount;
	}

	public synchronized void addOnlineCount() {
		onlineCount++;
	}

	public synchronized void subOnlienCount() {
		onlineCount--;
	}
}
