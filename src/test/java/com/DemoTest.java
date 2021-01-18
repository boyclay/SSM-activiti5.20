package com;

import static org.junit.Assert.*;

import java.util.Map;

import javax.sql.DataSource;

import org.activiti.engine.ProcessEngine;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.GenericXmlApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath*:*.xml")
public class DemoTest {

	@Test
	public void testAsser() {
		ApplicationContext context = new GenericXmlApplicationContext("classpath*:*.xml");
		Map<String, ProcessEngine> processEngineMap = context.getBeansOfType(ProcessEngine.class);
		ProcessEngine processEngine = processEngineMap.values().iterator().next();
		assertNotNull("not null", processEngine.getTaskService());
	}
}
