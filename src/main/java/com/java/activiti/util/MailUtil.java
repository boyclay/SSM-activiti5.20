package com.java.activiti.util;

import java.util.Map;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Folder;
import javax.mail.Message;
import javax.mail.Session;
import javax.mail.Store;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.mail.javamail.MimeMessageHelper;

/**
 * 接发邮件 待开发功能 并反问题
 * 
 * @author Bob
 * @version 1.0
 *
 */
public class MailUtil {
	private static Transport transport = null;

	/**
	 * 发送邮件
	 * @param 
	 * @return
	 */
	public static void sendMail(Map<String,String>map) {
		Properties properties = new Properties();
		properties.put("mail.transport.protocol", "smtp");// 连接协议
		properties.put("mail.smtp.host", "smtp.qq.com");// 主机名
		properties.put("mail.smtp.port", 465);// 端口号
		properties.put("mail.smtp.auth", "true");
		properties.put("mail.smtp.ssl.enable", "true");// 设置是否使用ssl安全连接 ---一般都使用
		properties.put("mail.debug", "true");// 设置是否显示debug信息 true 会在控制台显示相关信息
		// 得到回话对象
		Session session = Session.getInstance(properties);
		// 获取邮件对象 当前对象为MimeMessage对象
		MimeMessage message = new MimeMessage(session);
		// 设置发件人邮箱地址
		try {
			/**
			 * 设置收件人地址（可以增加多个收件人、抄送、密送），即下面这一行代码书写多行 设置收件人邮箱地址 多个邮件数组里面放多个
			 * 可以通过判断设置抄送、密送 MimeMessage.RecipientType.TO:发送
			 * MimeMessage.RecipientType.CC：抄送 MimeMessage.RecipientType.BCC：密送
			 */
			int len =map.get("toaddress").split(",").length;
			InternetAddress[] addrs = new InternetAddress[len];
			for (int i = 0; i < len; i++) {
				InternetAddress addr = new InternetAddress(map.get("toaddress").split(",")[i]);
				addrs[i] = addr;
			}
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
			helper.setTo(addrs);
			helper.setFrom(new InternetAddress("************@qq.com"));
			helper.setSubject(new String("催办邮件".getBytes(),"UTF-8"));
			helper.setText("123", true);
			if (transport == null) {
				transport = session.getTransport();
			}
			transport.connect("************@qq.com", "***************");// 密码为QQ邮箱开通的stmp服务后得到的客户端授权码
			// 发送邮件，并发送到所有收件人地址，message.getAllRecipients()
			// 获取到的是在创建邮件对象时添加的所有收件人,
			// 抄送人, 密送人
			transport.sendMessage(message, message.getAllRecipients());
			// 关闭邮件连接
			transport.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 接受邮件
	 * @param
	 * @return
	 */
	public static void receiveMail() {
		// 连接邮件服务器的参数配置
		Properties properties = new Properties();

		// 设置收件人的IMAP服务器
		properties.setProperty("mail.store.protocol", "imap");
		properties.setProperty("mail.imap.host", "imap.qq.com");
		properties.setProperty("mail.imap.port", "143");

		// 创建定义整个应用程序所需的环境信息的 Session 对象
		Session session = Session.getInstance(properties);
		// 设置调试信息在控制台打印出来
		session.setDebug(true);
		Store store = null;
		// 获得用户的邮件账户，注意通过pop3协议获取某个邮件夹的名称只能为inbox
		Folder folder = null;
		try {
			store = session.getStore("imap");
			// 连接收件人POP3服务器
			store.connect("imap.qq.com", "************@qq.com", "****************");
			folder = store.getFolder("INBOX");
			// 设置对邮件账户的访问权限
			folder.open(Folder.READ_WRITE);
			// 得到邮件账户的所有邮件信息
			Message[] messages = folder.getMessages();
			System.out.println("邮件数量：" + messages.length);
			for (int i = 0; i < messages.length; i++) {
				// 获得邮件主题
				String subject = messages[i].getSubject();
				// 获得邮件发件人
				Address[] from = messages[i].getFrom();
				// 获取邮件内容（包含邮件内容的html代码）
				// String content = (String) messages[i].getContent();
				System.out.println("邮件主题" + subject + "邮件发件人 " + from);
				if (i == 1) {
					break;
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				// 关闭邮件夹对象
				folder.close(false);
				// 关闭连接对象
				store.close();
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
