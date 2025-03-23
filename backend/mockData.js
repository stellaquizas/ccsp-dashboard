// Mock data for development
const mockData = {
  applications: {
    metrics: {
      totalCount: 235,
      typeBreakdown: [
        { type: "私人火葬", count: "85" },
        { type: "骨灰龕位", count: "53" },
        { type: "加放骨灰", count: "42" },
        { type: "火葬/土葬證明", count: "35" },
        { type: "公眾墳場安葬", count: "20" },
      ],
      statusBreakdown: [
        { status: "已批准", count: "120" },
        { status: "處理中", count: "45" },
        { status: "已提交", count: "40" },
        { status: "已拒絕", count: "25" },
        { status: "待處理", count: "5" },
      ],
      avgProcessingTime: [
        { type: "私人火葬", avg_time: "3.5" },
        { type: "骨灰龕位", avg_time: "5.2" },
        { type: "加放骨灰", avg_time: "2.8" },
        { type: "火葬/土葬證明", avg_time: "1.5" },
        { type: "公眾墳場安葬", avg_time: "7.3" },
      ],
      pendingApplications: {
        over_7_days: "18",
        over_14_days: "7",
      },
    },
    trends: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      count: (Math.floor(Math.random() * 10) + 5).toString(),
    })),
    forms: [
      {
        form_id: "FEHB135",
        name: "申請安排私人火葬",
        url: "https://app.fehd.gov.hk/ccsp/",
        pdf_url: "/english/forms/Fehb135.pdf",
        submission_count: 78,
        online_count: 65,
        paper_count: 13,
      },
      {
        form_id: "FEHB136",
        name: "申請編配骨灰龕位（只適用於離島新骨灰龕位）",
        url: "",
        pdf_url: "/english/forms/Fehb136.pdf",
        submission_count: 45,
        online_count: 30,
        paper_count: 15,
      },
      {
        form_id: "FEHB136A",
        name: "申請加放先人骨灰",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/feh136A.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb136a.pdf",
        submission_count: 57,
        online_count: 42,
        paper_count: 15,
      },
      {
        form_id: "FEHB143",
        name: "申請火葬/土葬證明書",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb143.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb143.pdf",
        submission_count: 29,
        online_count: 24,
        paper_count: 5,
      },
      {
        form_id: "FEHB144",
        name: "申請安葬於公眾墳場",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb144.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb144.pdf",
        submission_count: 18,
        online_count: 12,
        paper_count: 6,
      },
      {
        form_id: "FEHB148",
        name: "申請遷移或撿拾骨殖許可證",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb148.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb148.pdf",
        submission_count: 25,
        online_count: 18,
        paper_count: 7,
      },
      {
        form_id: "FEHB151",
        name: "申請移除先人骨灰",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb151.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb151.pdf",
        submission_count: 32,
        online_count: 27,
        paper_count: 5,
      },
      {
        form_id: "FEHB198",
        name: "申請在香港海域內將先人骨灰撒海",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb198.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb198.pdf",
        submission_count: 15,
        online_count: 12,
        paper_count: 3,
      },
      {
        form_id: "FEHB219",
        name: "申請在紀念花園內撒骨灰 / 安裝紀念牌匾",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb219.vxf&lang=zh_TW",
        pdf_url: "/english/forms/Fehb219.pdf",
        submission_count: 22,
        online_count: 19,
        paper_count: 3,
      },
      {
        form_id: "FEHB241",
        name: "申請撿拾非葬於墳場內的骨殖",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb241.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb241.pdf",
        submission_count: 11,
        online_count: 8,
        paper_count: 3,
      },
      {
        form_id: "FEHB251",
        name: "申請骨灰暫存服務",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb251.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb251.pdf",
        submission_count: 28,
        online_count: 22,
        paper_count: 6,
      },
      {
        form_id: "FEHB262",
        name: "申請安排金塔土葬或加葬骨殖／骨灰",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb262.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb262.pdf",
        submission_count: 9,
        online_count: 7,
        paper_count: 2,
      },
      {
        form_id: "FEHB263",
        name: "申請安排骨殖火化",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb263.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb263.pdf",
        submission_count: 14,
        online_count: 12,
        paper_count: 2,
      },
      {
        form_id: "FEHB264",
        name: "取消火葬場爐期申請書",
        url: "https://app.fehd.gov.hk/myeform/web/main.html?form=/myeform/vxf/fehb264.vxf&lang=zh_TW",
        pdf_url: "/english/forms/fehb264.pdf",
        submission_count: 7,
        online_count: 6,
        paper_count: 1,
      },
      {
        form_id: "FEHB278",
        name: "綠色殯葬中央登記名冊申請",
        url: "https://www.greenburial.gov.hk/gbcr/tc/register-online/index.html",
        pdf_url: "/english/forms/fehb278.pdf",
        submission_count: 31,
        online_count: 28,
        paper_count: 3,
      },
    ],
  },
  users: {
    metrics: {
      dau: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        count: (Math.floor(Math.random() * 25) + 10).toString(),
      })),
      mau: Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - 11 + i);
        return {
          month: date.toISOString().substring(0, 7),
          count: (Math.floor(Math.random() * 250) + 100).toString(),
        };
      }),
      totalUsers: 425,
    },
  },
};

module.exports = mockData;
