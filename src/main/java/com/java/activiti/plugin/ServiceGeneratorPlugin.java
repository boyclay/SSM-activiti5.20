package com.java.activiti.plugin;

import org.mybatis.generator.api.GeneratedJavaFile;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.java.*;

import java.util.ArrayList;
import java.util.List;

import static org.mybatis.generator.internal.util.StringUtility.stringHasValue;
import static org.mybatis.generator.internal.util.messages.Messages.getString;

/**
 * ServiceGeneratorPlugin
 * 生成service接口类和实现类
 */
public class ServiceGeneratorPlugin extends PluginAdapter {

	// 项目目录，eg: src/main/java
	private String targetProject;

	// service包名，eg:com.java.activiti.service.service
	private String servicePackage;

	// service实现类包名，eg:com.java.activiti.service.service.impl
	private String serviceImplPackage;

	// service接口名前缀
	private String servicePreffix;

	// service接口名后缀
	private String serviceSuffix;

	private String recordType;

	private String modelName;

	private FullyQualifiedJavaType model;

	//service接口类名
	private String serviceName;
	
	//service接口实现类名
	private String serviceImplName;

	@Override
	public boolean validate(List<String> warnings) {
		boolean valid = true;
		// 项目目录不能为空
		if (!stringHasValue(properties.getProperty("targetProject"))) { 
			warnings.add(getString("ValidationError.18",
					"MapperConfigPlugin", 
					"targetProject")); 
			valid = false;
		}
		//service接口包名
		if (!stringHasValue(properties.getProperty("servicePackage"))) {
			warnings.add(getString("ValidationError.18",
					"MapperConfigPlugin",
					"servicePackage"));
			valid = false;
		}
		// service实现类包名不能为空
		if (!stringHasValue(properties.getProperty("serviceImplPackage"))) { 
			warnings.add(getString("ValidationError.18",
					"MapperConfigPlugin",
					"serviceImplPackage"));
			valid = false;
		}
		targetProject = properties.getProperty("targetProject");//项目名
		servicePackage = properties.getProperty("servicePackage");//service接口包名
		serviceImplPackage = properties.getProperty("serviceImplPackage");//service接口实现类包名
		servicePreffix = stringHasValue(properties.getProperty("servicePreffix")) ? servicePreffix : "";//前缀
		serviceSuffix = stringHasValue(properties.getProperty("serviceSuffix")) ? serviceSuffix : "";//后缀
		return valid;
	}

	@Override
	public List<GeneratedJavaFile> contextGenerateAdditionalJavaFiles(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();//获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);//获取model名
		model = new FullyQualifiedJavaType(recordType);//获取model对象
		serviceName = servicePackage + "." + servicePreffix + modelName + "Service" + serviceSuffix;
		serviceImplName = serviceImplPackage + "."+ servicePreffix+ modelName + "ServiceImpl" + serviceSuffix;

		List<GeneratedJavaFile> answer = new ArrayList<>();
		GeneratedJavaFile gjf = generateServiceInterface(introspectedTable);
		GeneratedJavaFile gjf2 = generateServiceImpl(introspectedTable);
		answer.add(gjf);
		answer.add(gjf2);
		return answer;
	}

	// 生成service接口
	private GeneratedJavaFile generateServiceInterface(IntrospectedTable introspectedTable) {
		FullyQualifiedJavaType service = new FullyQualifiedJavaType(serviceName);
		Interface serviceInterface = new Interface(service);
		serviceInterface.setVisibility(JavaVisibility.PUBLIC);
		GeneratedJavaFile gjf = new GeneratedJavaFile(serviceInterface, targetProject, context.getJavaFormatter());
		return gjf;
	}

	// 生成service接口实现类
	private GeneratedJavaFile generateServiceImpl(IntrospectedTable introspectedTable) {
		FullyQualifiedJavaType service = new FullyQualifiedJavaType(serviceName);
		FullyQualifiedJavaType serviceImpl = new FullyQualifiedJavaType(serviceImplName);
		TopLevelClass clazz = new TopLevelClass(serviceImpl);
		clazz.setVisibility(JavaVisibility.PUBLIC);
		clazz.addImportedType(service);
		clazz.addSuperInterface(service);
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.stereotype.Service"));
		clazz.addAnnotation("@Service");

		String daoFieldType = introspectedTable.getMyBatis3JavaMapperType();
		String daoFieldName = firstCharToLowCase(daoFieldType.substring(daoFieldType.lastIndexOf(".") + 1));
		Field daoField = new Field(daoFieldName, new FullyQualifiedJavaType(daoFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType(daoFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.beans.factory.annotation.Autowired"));
		daoField.addAnnotation("@Autowired");
		daoField.setVisibility(JavaVisibility.PRIVATE);
		clazz.addField(daoField);

		// Method method = new Method("getDao");
		// method.addAnnotation("@Override");
		// FullyQualifiedJavaType methodReturnType = new
		// FullyQualifiedJavaType(superDaoInterface + "<"+modelName+">");
		// clazz.addImportedType(new FullyQualifiedJavaType(superDaoInterface));
		// clazz.addImportedType(methodReturnType);
		// method.setReturnType(methodReturnType);
		// method.addBodyLine("return " + daoFieldName + ";");
		// method.setVisibility(JavaVisibility.PUBLIC);
		// clazz.addMethod(method);

		GeneratedJavaFile gjf2 = new GeneratedJavaFile(clazz, targetProject, context.getJavaFormatter());
		return gjf2;
	}

	private String firstCharToLowCase(String str) {
		char[] chars = new char[1];
		// String str="ABCDE1234";
		chars[0] = str.charAt(0);
		String temp = new String(chars);
		if (chars[0] >= 'A' && chars[0] <= 'Z') {
			return str.replaceFirst(temp, temp.toLowerCase());
		}
		return str;
	}
}