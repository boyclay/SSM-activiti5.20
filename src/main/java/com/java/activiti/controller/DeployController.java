package com.java.activiti.controller;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipInputStream;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.bpmn.model.UserTask;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.editor.language.json.converter.BpmnJsonConverterUtil;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.java.activiti.model.PageInfo;
import com.java.activiti.model.ProcessModel;
import com.java.activiti.util.DateJsonValueProcessor;
import com.java.activiti.util.ResponseUtil;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

/**
 * ���̲������
 * 
 * @author Administrator
 *
 */
@Controller
@RequestMapping("/deploy")
public class DeployController {

	// ע��activitiService����
	@Resource
	private RepositoryService repositoryService;

	@Autowired
	private ObjectMapper objectMapper;

	/**
	 * ��ҳ��ѯ����
	 * 
	 * @param rows
	 * @param page
	 * @param s_name
	 * @param response
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/deployPage")
	public String deployPage(String rows, String page, String s_name, HttpServletResponse response) throws Exception {
		if (s_name == null) {
			s_name = "";
		}
		PageInfo pageInfo = new PageInfo();
		// ���ÿҳ��ʾ����
		Integer sizePage = Integer.parseInt(rows);
		pageInfo.setPageSize(sizePage);
		// �ڼ�ҳ
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		pageInfo.setPageIndex((Integer.parseInt(pageIndex) - 1) * sizePage);
		// ȡ��������
		long deployCount = repositoryService.createDeploymentQuery().deploymentNameLike("%" + s_name + "%").count();

		List<Deployment> deployList = repositoryService.createDeploymentQuery()// �������̲�ѯʵ��
				.orderByDeploymenTime().desc() // ����
				.deploymentNameLike("%" + s_name + "%") // ����Nameģ����ѯ
				.listPage(pageInfo.getPageIndex(), pageInfo.getPageSize());

		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.setExcludes(new String[] { "resources" });
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONObject result = new JSONObject();
		JSONArray jsonArray = JSONArray.fromObject(deployList, jsonConfig);
		result.put("rows", jsonArray);
		result.put("total", deployCount);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ���ϴ����̲���ZIP�ļ�
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/addDeploy")
	public String addDeploy(HttpServletResponse response, MultipartFile deployFile) throws Exception {
		repositoryService.createDeployment() // ��������
				.name(deployFile.getOriginalFilename()) // ��Ҫ������������
				.addZipInputStream(new ZipInputStream(deployFile.getInputStream()))// ���ZIP������
				.deploy();// ��ʼ����
		JSONObject result = new JSONObject();
		result.put("success", true);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ����ɾ������
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/delDeploy")
	public String delDeploy(HttpServletResponse response, String ids) throws Exception {
		// ����ַ���
		String[] idsStr = ids.split(",");
		for (String str : idsStr) {
			repositoryService.deleteDeployment(str, true);
		}
		JSONObject result = new JSONObject();
		result.put("success", true);
		ResponseUtil.write(response, result);
		return null;
	}

	/**
	 * ģ�ͻ�ȡ
	 * 
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("/getModelList")
	public String getModelList(@RequestParam(value = "page", required = false) String page,
			@RequestParam(value = "rows", required = false) String rows,@RequestParam(value = "name", required = false) String name, HttpServletResponse response) {
		PageInfo<Model> modelPage = new PageInfo<Model>();
		Integer pageSize = Integer.parseInt(rows);
		modelPage.setPageSize(pageSize);

		// �ڼ�ҳ
		String pageIndex = page;
		if (pageIndex == null || pageIndex == "") {
			pageIndex = "1";
		}
		modelPage.setPageIndex((Integer.parseInt(pageIndex) - 1) * pageSize);
		// ȡ����ҳ��
		int modelCount = 0;
		if(name!=null&&name!= ""){
			modelCount = (int) repositoryService.createNativeModelQuery().sql("select count(*) from act_re_model where name_ =#{processName}").parameter("processName", name).count();
		}else{
			modelCount = repositoryService.createModelQuery().list().size();
		}
		modelPage.setCount(modelCount);
		List<Model> modelList = null;
		if(name!=null&&name!= ""){
			modelList = repositoryService.createNativeModelQuery()
					.sql("select * from act_re_model  WHERE name_=#{name} ORDER BY create_time_ DESC  limit #{pageIndex},#{pageSize}")
					.parameter("pageIndex", modelPage.getPageIndex()).parameter("pageSize", modelPage.getPageSize()).parameter("name", name).list();
		}else{
			modelList = repositoryService.createNativeModelQuery()
					.sql("select * from act_re_model limit #{pageIndex},#{pageSize}")
					.parameter("pageIndex", modelPage.getPageIndex()).parameter("pageSize", modelPage.getPageSize()).list();
		}
		JsonConfig jsonConfig = new JsonConfig();
		jsonConfig.setExcludes(new String[] { "resources" });
		jsonConfig.registerJsonValueProcessor(java.util.Date.class, new DateJsonValueProcessor("yyyy-MM-dd hh:mm:ss"));
		JSONArray jsonArray = JSONArray.fromObject(modelList, jsonConfig);
		JSONObject json = new JSONObject();
		json.put("rows", jsonArray);
		json.put("total", modelCount);
		try {
			ResponseUtil.write(response, json);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * ģ�Ͳ���
	 * 
	 * @throws Exception
	 */
	@RequestMapping("/deployModel")
	public void deployModel(HttpServletResponse response,String modelId) throws Exception {
		Model modelData = repositoryService.getModel(modelId);
		ObjectNode modelNode;
		try {
			modelNode = (ObjectNode) new ObjectMapper()
					.readTree(repositoryService.getModelEditorSource(modelData.getId()));
			byte[] bpmnBytes = null;
			CustomBpmnJsonConverter.getConvertersToBpmnMap().put("UserTask", UserTaskExtendJsonConverter.class);//��չ�����¼Ӵ���
			CustomBpmnJsonConverter jsonConverter = new CustomBpmnJsonConverter();
//			BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
			BpmnModel model =jsonConverter.convertToBpmnModel(modelNode);
			bpmnBytes = new BpmnXMLConverter().convertToXML(model);
			String processName = modelData.getKey() + ".bpmn20.xml";
			Deployment d = repositoryService.createDeployment().name(modelData.getKey())
					.addString(processName, new String(bpmnBytes, "UTF8")).deploy();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * ģ�ͱ༭
	 * 
	 * @throws Exception
	 */
	@RequestMapping("/editorModel")
	public String editorModel(String modelId, HttpServletResponse response, HttpServletRequest request) {
		ObjectNode modelNode = null;
		Model model = this.repositoryService.getModel(modelId);
		if (model != null) {
			try {
				if (StringUtils.isNotEmpty(model.getMetaInfo())) {
					modelNode = (ObjectNode) this.objectMapper.readTree(model.getMetaInfo());
				} else {
					modelNode = this.objectMapper.createObjectNode();
					modelNode.put("name", model.getName());
				}
				modelNode.put("modelId", model.getId());
				ObjectNode editorJsonNode = (ObjectNode) this.objectMapper
						.readTree(new String(this.repositoryService.getModelEditorSource(model.getId()), "utf-8"));
				modelNode.put("model", editorJsonNode);
				response.sendRedirect(request.getContextPath() + "/act/rest/modeler.html?modelId=" + modelId);
			} catch (Exception e) {
				throw new ActivitiException("Error creating model JSON", e);
			}
		}
		return null;
	}

	/**
	 * ģ�͵���
	 * 
	 * @throws Exception
	 */

	@RequestMapping(value = "/exportModel") // ƥ�����href�е�download����
	public ResponseEntity<byte[]> exportModel(HttpServletResponse response, HttpServletRequest request, String modelId)
			throws IOException {
		try {
			Model modelData = repositoryService.getModel(modelId);
			JsonNode editorNode = new ObjectMapper()
					.readTree(repositoryService.getModelEditorSource(modelData.getId()));
			
			CustomBpmnJsonConverter.getConvertersToBpmnMap().put("UserTask", UserTaskExtendJsonConverter.class);//��չ�����¼Ӵ���
			CustomBpmnJsonConverter jsonConverter = new CustomBpmnJsonConverter();
			BpmnModel bpmnModel =jsonConverter.convertToBpmnModel(editorNode);
			
			BpmnXMLConverter xmlConverter = new BpmnXMLConverter();
			byte[] bpmnBytes = xmlConverter.convertToXML(bpmnModel);

			ByteArrayInputStream in = new ByteArrayInputStream(bpmnBytes);
			String filename = bpmnModel.getMainProcess().getId() + ".bpmn20.xml";
			HttpHeaders headers = new HttpHeaders();// httpͷ��Ϣ
			String downloadFileName = new String(filename.getBytes("UTF-8"), "utf-8");// ���ñ���
			File file = new File(downloadFileName);
			try {
				OutputStream os = new FileOutputStream(file);
				int bytesRead = 0;
				byte[] buffer = new byte[8192];
				while ((bytesRead = in.read(buffer, 0, 8192)) != -1) {
					os.write(buffer, 0, bytesRead);
				}
				os.close();
				in.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			headers.setContentDispositionFormData("attachment", downloadFileName);
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			// MediaType:������ý������ contentType�����������е�ý��������Ϣ
			return new ResponseEntity<byte[]>(FileUtils.readFileToByteArray(file), headers, HttpStatus.CREATED);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * ģ��ɾ��
	 * 
	 * @throws Exception
	 */
	@RequestMapping("/deleteModel")
	public void deleteModel(String modelId) {
		repositoryService.deleteModel(modelId);
	}
}
