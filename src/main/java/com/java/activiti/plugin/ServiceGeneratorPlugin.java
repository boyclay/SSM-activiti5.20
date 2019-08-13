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
 * ServiceGeneratorPlugin 生成service接口类和实现类
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

	// service接口类名
	private String serviceName;

	// service接口实现类名
	private String serviceImplName;

	@Override
	public boolean validate(List<String> warnings) {
		boolean valid = true;
		// 项目目录不能为空
		if (!stringHasValue(properties.getProperty("targetProject"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "targetProject"));
			valid = false;
		}
		// service接口包名
		if (!stringHasValue(properties.getProperty("servicePackage"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "servicePackage"));
			valid = false;
		}
		// service实现类包名不能为空
		if (!stringHasValue(properties.getProperty("serviceImplPackage"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "serviceImplPackage"));
			valid = false;
		}
		targetProject = properties.getProperty("targetProject");// 项目名
		servicePackage = properties.getProperty("servicePackage");// service接口包名
		serviceImplPackage = properties.getProperty("serviceImplPackage");// service接口实现类包名
		servicePreffix = stringHasValue(properties.getProperty("servicePreffix")) ? servicePreffix : "";// 前缀
		serviceSuffix = stringHasValue(properties.getProperty("serviceSuffix")) ? serviceSuffix : "";// 后缀
		return valid;
	}

	@Override
	public List<GeneratedJavaFile> contextGenerateAdditionalJavaFiles(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// 获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// 获取model名
		model = new FullyQualifiedJavaType(recordType);// 获取model对象
		serviceName = servicePackage + "." + servicePreffix + modelName + "Service" + serviceSuffix;
		serviceImplName = serviceImplPackage + "." + servicePreffix + modelName + "ServiceImpl" + serviceSuffix;

		List<GeneratedJavaFile> answer = new ArrayList<>();
		GeneratedJavaFile gjf = generateServiceInterface(introspectedTable);
		GeneratedJavaFile gjf2 = generateServiceImpl(introspectedTable);
		answer.add(gjf);
		answer.add(gjf2);
		return answer;
	}

	// 生成service接口
	private GeneratedJavaFile generateServiceInterface(IntrospectedTable introspectedTable) {
		
		recordType = introspectedTable.getBaseRecordType();// 获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// 获取model名
		model = new FullyQualifiedJavaType(recordType);// 获取model对象
		FullyQualifiedJavaType service = new FullyQualifiedJavaType(serviceName);
		Interface serviceInterface = new Interface(service);
		serviceInterface.setVisibility(JavaVisibility.PUBLIC);
		serviceInterface.addImportedType(new FullyQualifiedJavaType("java.util.List"));
		serviceInterface.addImportedType(model);
		
		FullyQualifiedJavaType intReturnType = new FullyQualifiedJavaType("int");
		FullyQualifiedJavaType IntegerReturnType = new FullyQualifiedJavaType("java.lang.Integer");
		FullyQualifiedJavaType listReturnType = new FullyQualifiedJavaType("java.util.List<"+modelName+">");
		
		Method deleteByPrimaryKeyMethod = new Method("deleteByPrimaryKey");
		Parameter deleteByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		deleteByPrimaryKeyMethod.addParameter(deleteByPrimaryKeyparameter);
		deleteByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		deleteByPrimaryKeyMethod.setReturnType(intReturnType);
		serviceInterface.addMethod(deleteByPrimaryKeyMethod);
		
		Method insertMethod = new Method("insert");
		Parameter insertParameter = new Parameter(model, "record");
		insertMethod.setVisibility(JavaVisibility.PUBLIC);
		insertMethod.addParameter(insertParameter);
		insertMethod.setReturnType(intReturnType);
		serviceInterface.addMethod(insertMethod);
		
		Method selectByPrimaryKeyMethod = new Method("selectByPrimaryKey");
		Parameter selectByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		selectByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		selectByPrimaryKeyMethod.addParameter(selectByPrimaryKeyparameter);
		selectByPrimaryKeyMethod.setReturnType(model);
		serviceInterface.addMethod(selectByPrimaryKeyMethod);
		
		Method selectAllMethod = new Method("selectAll");
		selectAllMethod.setVisibility(JavaVisibility.PUBLIC);
		selectAllMethod.setReturnType(listReturnType);
		serviceInterface.addMethod(selectAllMethod);
		
		Method updateByPrimaryKeyMethod = new Method("updateByPrimaryKey");
		Parameter updateByPrimaryKeyParameter = new Parameter(model, "record");
		updateByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		updateByPrimaryKeyMethod.addParameter(updateByPrimaryKeyParameter);
		updateByPrimaryKeyMethod.setReturnType(intReturnType);
		serviceInterface.addMethod(updateByPrimaryKeyMethod);
	
		GeneratedJavaFile gjf = new GeneratedJavaFile(serviceInterface, targetProject, context.getJavaFormatter());
		return gjf;
	}

	// 生成service接口实现类
	private GeneratedJavaFile generateServiceImpl(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// 获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// 获取model名
		model = new FullyQualifiedJavaType(recordType);// 获取model对象
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
		clazz.addImportedType(new FullyQualifiedJavaType("java.util.List"));
		clazz.addImportedType(model);
		daoField.addAnnotation("@Autowired");
		daoField.setVisibility(JavaVisibility.PRIVATE);
		clazz.addField(daoField);
		
		FullyQualifiedJavaType intReturnType = new FullyQualifiedJavaType("int");
		FullyQualifiedJavaType IntegerReturnType = new FullyQualifiedJavaType("java.lang.Integer");
		FullyQualifiedJavaType listReturnType = new FullyQualifiedJavaType("java.util.List<"+modelName+">");
		Method deleteByPrimaryKeyMethod = new Method("deleteByPrimaryKey");
		deleteByPrimaryKeyMethod.addAnnotation("@Override");
		Parameter parameter = new Parameter(IntegerReturnType, "id");
		deleteByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		deleteByPrimaryKeyMethod.addParameter(parameter);
		deleteByPrimaryKeyMethod.setReturnType(intReturnType);
		deleteByPrimaryKeyMethod.addBodyLine("return " + daoFieldName + ".deleteByPrimaryKey(id);");
		clazz.addMethod(deleteByPrimaryKeyMethod);
		
		Method insertMethod = new Method("insert");
		insertMethod.addAnnotation("@Override");
		Parameter insertParameter = new Parameter(model, "record");
		insertMethod.setVisibility(JavaVisibility.PUBLIC);
		insertMethod.addParameter(insertParameter);
		insertMethod.setReturnType(intReturnType);
		insertMethod.addBodyLine("return " + daoFieldName + ".insert(record);");
		clazz.addMethod(insertMethod);
		
		Method selectByPrimaryKeyMethod = new Method("selectByPrimaryKey");
		selectByPrimaryKeyMethod.addAnnotation("@Override");
		Parameter selectByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		selectByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		selectByPrimaryKeyMethod.addParameter(selectByPrimaryKeyparameter);
		selectByPrimaryKeyMethod.setReturnType(model);
		selectByPrimaryKeyMethod.addBodyLine("return " + daoFieldName + ".selectByPrimaryKey(id);");
		clazz.addMethod(selectByPrimaryKeyMethod);
		
		Method selectAllMethod = new Method("selectAll");
		selectAllMethod.addAnnotation("@Override");
		selectAllMethod.setVisibility(JavaVisibility.PUBLIC);
		selectAllMethod.setReturnType(listReturnType);
		selectAllMethod.addBodyLine("return " + daoFieldName + ".selectAll();");
		clazz.addMethod(selectAllMethod);
		
		Method updateByPrimaryKeyMethod = new Method("updateByPrimaryKey");
		updateByPrimaryKeyMethod.addAnnotation("@Override");
		Parameter updateByPrimaryKeyParameter = new Parameter(model, "record");
		updateByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		updateByPrimaryKeyMethod.addParameter(updateByPrimaryKeyParameter);
		updateByPrimaryKeyMethod.setReturnType(intReturnType);
		updateByPrimaryKeyMethod.addBodyLine("return " + daoFieldName + ".updateByPrimaryKey(record);");
		clazz.addMethod(updateByPrimaryKeyMethod);

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