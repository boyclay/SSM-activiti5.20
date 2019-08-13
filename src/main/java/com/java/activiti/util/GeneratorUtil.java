package com.java.activiti.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.mybatis.generator.api.MyBatisGenerator;
import org.mybatis.generator.config.Configuration;
import org.mybatis.generator.config.xml.ConfigurationParser;
import org.mybatis.generator.internal.DefaultShellCallback;

public class GeneratorUtil {
	public static void codeGenerate(String tableName) {
		try {
			Properties properties = new Properties();
			properties.setProperty("tableName",tableName);
			List<String> warnings = new ArrayList<String>();
			boolean overwrite = true;
			String url = GeneratorUtil.class.getClassLoader().getResource("./").getPath();
			File configFile = new File(url + "/generatorConfig.xml");
			ConfigurationParser cp = new ConfigurationParser(properties, warnings);
			Configuration config = cp.parseConfiguration(configFile);
			DefaultShellCallback callback = new DefaultShellCallback(overwrite);
			MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config, callback, warnings);
			myBatisGenerator.generate(null);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
