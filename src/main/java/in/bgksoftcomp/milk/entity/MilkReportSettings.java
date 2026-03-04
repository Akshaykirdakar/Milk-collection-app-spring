package in.bgksoftcomp.milk.entity;

public class MilkReportSettings {
	
	 private String reportHeading = "Milk Collection Report";
	    private boolean showFat = true;
	    private boolean showClr = true;
	    private boolean showSnf = true;
	    private boolean showRate = true;
		public String getReportHeading() {
			return reportHeading;
		}
		public void setReportHeading(String reportHeading) {
			this.reportHeading = reportHeading;
		}
		public boolean isShowFat() {
			return showFat;
		}
		public void setShowFat(boolean showFat) {
			this.showFat = showFat;
		}
		public boolean isShowClr() {
			return showClr;
		}
		public void setShowClr(boolean showClr) {
			this.showClr = showClr;
		}
		public boolean isShowSnf() {
			return showSnf;
		}
		public void setShowSnf(boolean showSnf) {
			this.showSnf = showSnf;
		}
		public boolean isShowRate() {
			return showRate;
		}
		public void setShowRate(boolean showRate) {
			this.showRate = showRate;
		}
	    
	    

}
