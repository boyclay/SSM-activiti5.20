 package com.java.activiti.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.activiti.editor.constants.ModelDataJsonConstants;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.RepositoryService;
import org.activiti.engine.repository.Model;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.java.activiti.model.ProcessModel;

import net.sf.json.JSONObject;

@RestController
public class ModelEditorJsonRestResource
  implements ModelDataJsonConstants
{
  protected static final Logger LOGGER = LoggerFactory.getLogger(ModelEditorJsonRestResource.class);

  @Autowired
  private RepositoryService repositoryService;

  @Autowired
  private ObjectMapper objectMapper;

  @RequestMapping(value={"/service/model/{modelId}/json"}, produces={"application/json"})
  public ObjectNode getEditorJson(@PathVariable String modelId,HttpServletResponse response,HttpServletRequest request) { ObjectNode modelNode = null;

    Model model = this.repositoryService.getModel(modelId);

    if (model != null) {
      try {
        if (StringUtils.isNotEmpty(model.getMetaInfo())) {
          modelNode = (ObjectNode)this.objectMapper.readTree(model.getMetaInfo());
        } else {
          modelNode = this.objectMapper.createObjectNode();
          modelNode.put("name", model.getName());
        }
        modelNode.put("modelId", model.getId());
        ObjectNode editorJsonNode = (ObjectNode)this.objectMapper.readTree(new String(this.repositoryService
          .getModelEditorSource(model
          .getId()), "utf-8"));
        modelNode.put("model", editorJsonNode);
//        response.sendRedirect(request.getContentType()+"/act/rest/modeeler.html?modelId="+modelId);
      }
      catch (Exception e) {
        LOGGER.error("Error creating model JSON", e);
        throw new ActivitiException("Error creating model JSON", e);
      }
    }
    return modelNode;
  }
  
  @RequestMapping(value={"/service/create"})
  public String createEditorModel(HttpServletResponse response,HttpServletRequest request,ProcessModel processModel) {
	Model modelData = repositoryService.newModel();
	try {
		ObjectMapper objectMapper = new ObjectMapper();
		ObjectNode editorNode = objectMapper.createObjectNode();
		editorNode.put("id", "canvas");
		editorNode.put("resourceId", "canvas");
		ObjectNode propertiesNode = objectMapper.createObjectNode();
		propertiesNode.put("name", processModel.getProcessName());
		propertiesNode.put("process_id", processModel.getProcessKey());
		propertiesNode.put("process_author", "Aven");
		propertiesNode.put("executionlisteners", "");
		propertiesNode.put("eventlisteners", "");
		editorNode.put("properties", propertiesNode);
		ObjectNode stencilSetNode = objectMapper.createObjectNode();
		stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
		editorNode.put("stencilset", stencilSetNode);
		ObjectNode modelObjectNode = objectMapper.createObjectNode();
		modelObjectNode.put(ModelDataJsonConstants.MODEL_NAME, processModel.getProcessName());
		modelObjectNode.put(ModelDataJsonConstants.MODEL_REVISION, 1);
		modelObjectNode.put(ModelDataJsonConstants.MODEL_DESCRIPTION, processModel.getProcessDescription());
		modelData.setMetaInfo(modelObjectNode.toString());
		modelData.setName(processModel.getProcessName());
		modelData.setKey(StringUtils.defaultString(processModel.getProcessKey()));
		repositoryService.saveModel(modelData);
		repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("UTF8"));
		return modelData.getId();
//		response.sendRedirect(request.getContextPath()+"/act/rest/modeler.html?modelId="+modelData.getId());
	} catch (Exception e) {
		// LOGGER.error(Constant.EXCEPTION, e);
		e.printStackTrace();
	}
	return null;
  }
  
  @RequestMapping(value={"/service/model/{modelId}/save"})
  public void saveModel(HttpServletRequest request,HttpServletResponse response,@PathVariable("modelId") String modelId) {
	  try {
			// LOGGER.info("进来了");
			Model model = this.repositoryService.getModel(modelId);
			JSONObject modelJson = JSONObject.fromObject(model.getMetaInfo());
			modelJson.put("name", request.getParameter("name"));
			modelJson.put("description", request.getParameter("description"));
			model.setMetaInfo(modelJson.toString());
			model.setName(request.getParameter("name"));
			this.repositoryService.saveModel(model);
			this.repositoryService.addModelEditorSource(model.getId(),
					(request.getParameter("json_xml")).getBytes("UTF8"));
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			byte[] result = outStream.toByteArray();
			this.repositoryService.addModelEditorSourceExtra(model.getId(), result);
			outStream.close();

		} catch (Exception e) {
			// LOGGER.error(Constant.SAVE_MODEL_ERROR_MSG, e);
			throw new ActivitiException("保存失败",e);
		}
  }
  
  @RequestMapping(value={"act/rest/"})
  public ModelAndView  redirectMain() {
	  ModelAndView  mv = new ModelAndView();
	  mv.setViewName("page/processDesign");
	  return mv;
  }
}