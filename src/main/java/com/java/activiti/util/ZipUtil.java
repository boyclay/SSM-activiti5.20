package com.java.activiti.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtil {
 
	private static final int BUFFER_SIZE = 2 * 1024;
 
	/**
	 * ѹ����ZIP ����1
	 * 
	 * @param srcDir           ѹ���ļ���·��
	 * @param out              ѹ���ļ������
	 * @param KeepDirStructure �Ƿ���ԭ����Ŀ¼�ṹ,true:����Ŀ¼�ṹ;
	 * 
	 *                         false:�����ļ��ܵ�ѹ������Ŀ¼��(ע�⣺������Ŀ¼�ṹ���ܻ����ͬ���ļ�,��ѹ��ʧ��)
	 * 
	 * @throws RuntimeException ѹ��ʧ�ܻ��׳�����ʱ�쳣
	 * 
	 */
 
	public static void toZip(String srcDir, OutputStream out, boolean KeepDirStructure) throws RuntimeException {
 
		long start = System.currentTimeMillis();
		ZipOutputStream zos = null;
		try {
			zos = new ZipOutputStream(out);
			File sourceFile = new File(srcDir);
			compress(sourceFile, zos, sourceFile.getName(), KeepDirStructure);
			long end = System.currentTimeMillis();
			System.out.println("ѹ����ɣ���ʱ��" + (end - start) + " ms");
		} catch (Exception e) {
			throw new RuntimeException("zip error from ZipUtils", e);
		} finally {
			if (zos != null) {
				try {
					zos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
 
	/**
	 * ѹ����ZIP ����2
	 * 
	 * @param srcFiles ��Ҫѹ�����ļ��б�
	 * @param out      ѹ���ļ������
	 * @throws RuntimeException ѹ��ʧ�ܻ��׳�����ʱ�쳣
	 */
	public static void toZip(List<File> srcFiles, OutputStream out) throws RuntimeException {
		long start = System.currentTimeMillis();
		ZipOutputStream zos = null;
		try {
			zos = new ZipOutputStream(out);
			for (File srcFile : srcFiles) {
				byte[] buf = new byte[BUFFER_SIZE];
				zos.putNextEntry(new ZipEntry(srcFile.getName()));
				int len;
				FileInputStream in = new FileInputStream(srcFile);
				while ((len = in.read(buf)) != -1) {
					zos.write(buf, 0, len);
				}
				zos.closeEntry();
				in.close();
			}
			long end = System.currentTimeMillis();
			System.out.println("ѹ����ɣ���ʱ��" + (end - start) + " ms");
		} catch (Exception e) {
			throw new RuntimeException("zip error from ZipUtils", e);
		} finally {
			if (zos != null) {
				try {
					zos.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
 
	/**
	 * �ݹ�ѹ������
	 * 
	 * @param sourceFile       Դ�ļ�
	 * @param zos              zip�����
	 * @param name             ѹ���������
	 * @param KeepDirStructure �Ƿ���ԭ����Ŀ¼�ṹ, true:����Ŀ¼�ṹ;
	 *                         false:�����ļ��ܵ�ѹ������Ŀ¼��(ע�⣺������Ŀ¼�ṹ���ܻ����ͬ���ļ�,��ѹ��ʧ��)
	 * @throws Exception
	 * 
	 */
 
	private static void compress(File sourceFile, ZipOutputStream zos, String name, boolean KeepDirStructure)
			throws Exception {
 
		byte[] buf = new byte[BUFFER_SIZE];
		if (sourceFile.isFile()) {
			// ��zip�����������һ��zipʵ�壬��������nameΪzipʵ����ļ�������
			zos.putNextEntry(new ZipEntry(name));
			// copy�ļ���zip�������
			int len;
			FileInputStream in = new FileInputStream(sourceFile);
			while ((len = in.read(buf)) != -1) {
				zos.write(buf, 0, len);
			}
			// Complete the entry
			zos.closeEntry();
			in.close();
		} else {
			File[] listFiles = sourceFile.listFiles();
			if (listFiles == null || listFiles.length == 0) {
				// ��Ҫ����ԭ�����ļ��ṹʱ,��Ҫ�Կ��ļ��н��д���
				if (KeepDirStructure) {
					// ���ļ��еĴ���
					zos.putNextEntry(new ZipEntry(name + "/"));
					// û���ļ�������Ҫ�ļ���copy
					zos.closeEntry();
				}
			} else {
				for (File file : listFiles) {
					// �ж��Ƿ���Ҫ����ԭ�����ļ��ṹ
					if (KeepDirStructure) {
						// ע�⣺file.getName()ǰ����Ҫ���ϸ��ļ��е����ּ�һб��,
						// ��Ȼ���ѹ�����оͲ��ܱ���ԭ�����ļ��ṹ,���������ļ����ܵ�ѹ������Ŀ¼����
						compress(file, zos, name + "/" + file.getName(), KeepDirStructure);
					} else {
						compress(file, zos, file.getName(), KeepDirStructure);
					}
				}
			}
		}
	}
	public static void main(String[] args) throws Exception {
		/** ����ѹ������1 */
		
		/** ����ѹ������2 */
//		List<File> fileList = new ArrayList<>();
//		fileList.add(new File("D:/Java/jdk1.7.0_45_64bit/bin/jar.exe"));
//		fileList.add(new File("D:/Java/jdk1.7.0_45_64bit/bin/java.exe"));
//		FileOutputStream fos2 = new FileOutputStream(new File("c:/mytest02.zip"));
//		ZipUtils.toZip(fileList, fos2);
	}
 
}