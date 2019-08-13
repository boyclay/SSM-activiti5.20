package com.java.activiti.plugin;

import org.mybatis.generator.api.GeneratedJavaFile;
import org.mybatis.generator.api.IntrospectedTable;
import org.mybatis.generator.api.PluginAdapter;
import org.mybatis.generator.api.dom.java.*;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;

import static org.mybatis.generator.internal.util.StringUtility.stringHasValue;
import static org.mybatis.generator.internal.util.messages.Messages.getString;

/**
 * ControllerGeneratorPlugin 生成controller类
 */
public class ControllerGeneratorPlugin extends PluginAdapter {

	// 项目目录，eg: src/main/java
	private String targetProject;

	// control包名，eg:com.java.activiti.Controller
	private String controllerPackage;

	// controller接口名前缀
	private String controllerPreffix;

	// controller接口名后缀
	private String controllerSuffix;

	private String recordType;

	private String modelName;

	private FullyQualifiedJavaType model;

	// controller接口类名
	private String controllerName;

	@Override
	public boolean validate(List<String> warnings) {
		boolean valid = true;
		// 项目目录不能为空
		if (!stringHasValue(properties.getProperty("targetProject"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "targetProject"));
			valid = false;
		}
		// controller接口包名
		if (!stringHasValue(properties.getProperty("controllerPackage"))) {
			warnings.add(getString("ValidationError.18", "MapperConfigPlugin", "controllerPackage"));
			valid = false;
		}
		targetProject = properties.getProperty("targetProject");// 项目名
		controllerPackage = properties.getProperty("controllerPackage");// controller接口包名
		controllerPreffix = stringHasValue(properties.getProperty("controllerPreffix")) ? controllerPreffix : "";// 前缀
		controllerSuffix = stringHasValue(properties.getProperty("controllerSuffix")) ? controllerSuffix : "";// 后缀
		return valid;
	}

	@Override
	public List<GeneratedJavaFile> contextGenerateAdditionalJavaFiles(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// 获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// 获取model名
		controllerName = controllerPackage + "." + controllerPreffix + modelName + "Controller" + controllerSuffix;
		List<GeneratedJavaFile> answer = new ArrayList<>();
		GeneratedJavaFile gjf = generateController(introspectedTable);
		answer.add(gjf);
		return answer;
	}

	// 生成controller类
	private GeneratedJavaFile generateController(IntrospectedTable introspectedTable) {
		recordType = introspectedTable.getBaseRecordType();// 获取model
		modelName = recordType.substring(recordType.lastIndexOf(".") + 1);// 获取model名
		model = new FullyQualifiedJavaType(recordType);// 获取model对象
		
		FullyQualifiedJavaType controller = new FullyQualifiedJavaType(controllerName);
		TopLevelClass clazz = new TopLevelClass(controller);
		clazz.setVisibility(JavaVisibility.PUBLIC);
		clazz.addAnnotation("@Controller");
		clazz.addAnnotation("@RequestMapping(\"/"+modelName+"\")");
		String servieFieldName = modelName+"Service";
		String serviceFieldType = "com.java.activiti.service."+modelName+"Service";
		Field serviceField = new Field(modelName+"Service", new FullyQualifiedJavaType(serviceFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType(serviceFieldType));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.beans.factory.annotation.Autowired"));
		clazz.addImportedType(new FullyQualifiedJavaType("java.util.List"));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.stereotype.Controller"));
		clazz.addImportedType(new FullyQualifiedJavaType("org.springframework.web.bind.annotation.RequestMapping"));
		clazz.addImportedType(model);
		serviceField.addAnnotation("@Autowired");
		serviceField.setVisibility(JavaVisibility.PRIVATE);
		clazz.addField(serviceField);
		
		FullyQualifiedJavaType intReturnType = new FullyQualifiedJavaType("int");
		FullyQualifiedJavaType IntegerReturnType = new FullyQualifiedJavaType("java.lang.Integer");
		FullyQualifiedJavaType listReturnType = new FullyQualifiedJavaType("java.util.List<" + modelName + ">");

		Method deleteByPrimaryKeyMethod = new Method("deleteByPrimaryKey");
		deleteByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/deleteByPrimaryKey\")");
		Parameter deleteByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		deleteByPrimaryKeyMethod.addParameter(deleteByPrimaryKeyparameter);
		deleteByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		deleteByPrimaryKeyMethod.setReturnType(intReturnType);
		String a = "/deleteByPrimaryKey";
		deleteByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".deleteByPrimaryKey(id);");
		clazz.addMethod(deleteByPrimaryKeyMethod);

		Method insertMethod = new Method("insert");
		insertMethod.addAnnotation("@RequestMapping(\"/insert\")");
		Parameter insertParameter = new Parameter(model, "record");
		insertMethod.setVisibility(JavaVisibility.PUBLIC);
		insertMethod.addParameter(insertParameter);
		insertMethod.setReturnType(intReturnType);
		insertMethod.addBodyLine("return " + servieFieldName + ".insert(record);");
		clazz.addMethod(insertMethod);

		Method selectByPrimaryKeyMethod = new Method("selectByPrimaryKey");
		selectByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/selectByPrimaryKey\")");
		Parameter selectByPrimaryKeyparameter = new Parameter(IntegerReturnType, "id");
		selectByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		selectByPrimaryKeyMethod.addParameter(selectByPrimaryKeyparameter);
		selectByPrimaryKeyMethod.setReturnType(model);
		selectByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".selectByPrimaryKey(id);");
		clazz.addMethod(selectByPrimaryKeyMethod);

		Method selectAllMethod = new Method("selectAll");
		selectAllMethod.addAnnotation("@RequestMapping(\"/selectAll\")");
		selectAllMethod.setVisibility(JavaVisibility.PUBLIC);
		selectAllMethod.setReturnType(listReturnType);
		selectAllMethod.addBodyLine("return " + servieFieldName + ".selectAll();");
		clazz.addMethod(selectAllMethod);

		Method updateByPrimaryKeyMethod = new Method("updateByPrimaryKey");
		updateByPrimaryKeyMethod.addAnnotation("@RequestMapping(\"/updateByPrimaryKey\")");
		Parameter updateByPrimaryKeyParameter = new Parameter(model, "record");
		updateByPrimaryKeyMethod.setVisibility(JavaVisibility.PUBLIC);
		updateByPrimaryKeyMethod.addParameter(updateByPrimaryKeyParameter);
		updateByPrimaryKeyMethod.setReturnType(intReturnType);
		updateByPrimaryKeyMethod.addBodyLine("return " + servieFieldName + ".updateByPrimaryKey(record);");
		clazz.addMethod(updateByPrimaryKeyMethod);
		GeneratedJavaFile gjf = new GeneratedJavaFile(clazz, targetProject, context.getJavaFormatter());
		return gjf;
	}

	private String firstCharToLowCase(String str) {
		char[] chars = new char[1];
		chars[0] = str.charAt(0);
		String temp = new String(chars);
		if (chars[0] >= 'A' && chars[0] <= 'Z') {
			return str.replaceFirst(temp, temp.toLowerCase());
		}
		return str;
	}
}