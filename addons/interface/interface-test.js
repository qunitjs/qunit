var testStructure1 = testStructure2 = {
    "id": "84",
    "language": "en-GB",
    "nappUpdate": "2012-06-08 15:52:02",
    "title": "Intro Plain text",
    "dataUrl": "http://wexiing.com/index.php?option=com_xing&task=userdata.load&cid=527&mid=1&id=84",
    "senddataUrl": "http://wexiing.com/index.php?option=com_xing&task=userdata.save&cid=527&mid=1&id=84",
    "xtype": "pageinfo",
    "elements": [
        {
            "name": "page1",
            "xtype": "page",
            "transition": true,
            "elements": [
                {
                    "xtype": "block",
                    "elements": [
                        {
                            "xtype": "view",
                            "elements": [
                                {
                                    "xtype": "rowhead",
                                    "elements": [
                                        {
                                            "xtype": "h1",
                                            "text": "Introduction to this course",
                                            "id": "lbl[0]"
                                        }
                                    ],
                                    "class": "elements_1"
                                },
                                {
                                    "xtype": "row",
                                    "elements": [
                                        {
                                            "xtype": "label",
                                            "text": "introduktion",
                                            "id": "lbl[1]"
                                        }
                                    ],
                                    "class": "elements_1"
                                }
                            ],
                            "class": "elements_2"
                        }
                    ],
                    "class": "elements_1"
                }
            ],
            "class": "elements_1"
        }
    ],
    "class": "elements_1"
};
var testStructure3 = {
    "id": "not a number",
    "language": "en-GB",
    "nappUpdate": "2012-06-08 15:52:02",
    "title": "Intro Plain text",
    "dataUrl": "URI",
    "senddataUrl": "http://wexiing.com/index.php?option=com_xing&task=userdata.save&cid=527&mid=1&id=84",
    "xtype": "pageinfo",
    "elements": [
        {
            "name": "page1",
            "xtype": "page",
            "transition": true,
            "class": "elements_1"
        }
    ],
    "class": "elements_1"
};
var testStructure4 = {
    "id": "not a number",
    "language": "en-GB",
    "nappUpdate": "2012-06-08 15:52:02",
    "title": "Intro Plain text",
    "senddataUrl": "http://wexiing.com/index.php?option=com_xing&task=userdata.save&cid=527&mid=1&id=84",
    "xtype": "pageinfo",
    "class": "elements_1",
    "elements": []
};

test("equalStructure", 2, function () {
	QUnit.equalStructure(testStructure2, testStructure1, "These two objects have the same structure.");
	QUnit.equalStructure(testStructure3, testStructure1, "These two objects have the same structure on the first level but not the same data");
	//should be in a notEqualStructure testQUnit.equalStructure(testStructure4, testStructure1);
});
test("deepEqualStructure", 1, function () {
	QUnit.deepEqualStructure(testStructure2, testStructure1, 100, "These two objects have the same structure.");
//	QUnit.deepEqualStructure(testStructure3, testStructure1, 2, "These two objects have only the same structure on the first level.");
//	QUnit.deepEqualStructure(testStructure4, testStructure1);
});
test("notEqualStructure", 1, function () {
//	QUnit.notEqualStructure(testStructure2, testStructure1, "These two objects have the same structure.");
//	QUnit.notEqualStructure(testStructure3, testStructure1);
	QUnit.notEqualStructure(testStructure4, testStructure1);
});
test("notDeepEqualStructure", 3, function () {
//	QUnit.notDeepEqualStructure(testStructure2, testStructure1, "These two objects have the same structure.");
	QUnit.notDeepEqualStructure(testStructure3, testStructure1, 1,"These two objects have only the same structure on the first level.");
	QUnit.notDeepEqualStructure(testStructure3, testStructure1, 1);
	QUnit.notDeepEqualStructure(testStructure4, testStructure1);
});
