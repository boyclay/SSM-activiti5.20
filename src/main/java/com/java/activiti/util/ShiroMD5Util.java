package com.java.activiti.util;

import org.apache.shiro.crypto.hash.SimpleHash;

public class ShiroMD5Util {
    //���user��������ܷ���
    public static String  getMD5Password(String passoword) {
        String hashAlgorithmName = "MD5";//���ܷ�ʽ  
        int hashIterations = 1;//����1��  
        SimpleHash hash = new SimpleHash(hashAlgorithmName,passoword.getBytes(),null,hashIterations);
        return hash.toString();
    }  
}
