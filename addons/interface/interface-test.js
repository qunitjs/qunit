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
    "elements": [],
    "dataUrl": "url"
};

test("structure", 3, function () {
	QUnit.structure(testStructure2, testStructure1, "these two should have the same structure");
	QUnit.structure(testStructure3, testStructure1);
	QUnit.structure(testStructure4, testStructure1);
});
/*
test("structureDeep", function () {
	var halfPi = Math.PI / 2,
		sqrt2 = Math.sqrt(2);

	QUnit.notClose(6, 7, 0);
	QUnit.notClose(7, 7.2, 0.1);
	QUnit.notClose(7, 7.2, 0.19999999999);

	QUnit.notClose(3.141, Math.PI, 0.0001);
	QUnit.notClose(3.1, Math.PI, 0.001);

	QUnit.notClose(halfPi, 1.57, 0.0001);

	QUnit.notClose(sqrt2, 1.4142, 0.00001);

	QUnit.notClose(Infinity, -Infinity, 5);
});
*/