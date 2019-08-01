package com.java.activiti.listener;

import java.util.Map;

import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import com.java.activiti.event.CustomizeEvent;
import com.java.activiti.util.MailUtil;

@Component
public class SmsListener implements ApplicationListener<CustomizeEvent> {

	@Override
	public void onApplicationEvent(CustomizeEvent customizeEvent) {
		MailUtil.sendMail((Map<String,String>)customizeEvent.getSource()); 
	}
}
