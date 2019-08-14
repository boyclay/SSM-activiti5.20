package com.java.activiti.util;

import org.apache.shiro.crypto.RandomNumberGenerator;
import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;
import org.springframework.stereotype.Component;

import com.java.activiti.model.User;

/**
 * @auther wqb
 * @date 2019/8/14
 */
@Component
public class PasswordHelper {

	private RandomNumberGenerator randomNumberGenerator = new SecureRandomNumberGenerator();

	private String algorithName = "MD5";

	private int hashInterations = 1;

	//�����㷨
	public void encryptPassword(User user) {
		if (user.getPassword() != null) {
			String salt = randomNumberGenerator.nextBytes().toHex();// ����������� ��Ҫ���ݿ�洢
			//����SimpleHashָ��ɢ���㷨������1���㷨���ƣ�2���û���������룻3����ֵ��������ɵģ���4����������
			String newPassword = new SimpleHash(algorithName, user.getPassword(), ByteSource.Util.bytes(salt),
					hashInterations).toHex();
			user.setPassword(newPassword);
		}
	}
}
