import {Component, Inject, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";

export class SampleDialogData {

    constructor(public method: string, public limit: number, public ratio: number) {
    }
}

export class StrategyItem {

    constructor(public method: string,
                public label: string,
                public description: string,
                public passes: number) {
    }
}

@Component({
    templateUrl: 'js/feed-mgr/visual-query/transform-data/main-dialogs/sample-dialog.html',
    styleUrls: ["js/feed-mgr/visual-query/transform-data/main-dialogs/sample-dialog.scss"]
})
export class SampleDialog {

    public method: string;
    public options: StrategyItem[] = [];
    public numSamples: number = 1000;
    public ratio: number = 10;

    @ViewChild(MatSelectionList) selectedOptions: MatSelectionList;

    constructor(private dialog: MatDialogRef<SampleDialog>, @Inject(MAT_DIALOG_DATA) public data: SampleDialogData) {

        this.options.push(new StrategyItem("first", "First records", "Sample first n rows", 0));
        this.options.push(new StrategyItem("rndnum", "Random (#)", "Sample approx. n random rows", 2));
        this.options.push(new StrategyItem("ratio", "Random (ratio)", "Sample % of random rows", 1));

        //this.options.push(new StrategyItem("last", "Last records", "Sample last n rows"));

        this.method = (data.method == null ? "first" : data.method);
        this.ratio = (data.ratio == null ? 10 : data.ratio * 100);
        this.numSamples = data.limit;
    }

    ngOnInit() {
        this.selectedOptions.selectionChange.subscribe((s: MatSelectionListChange) => {
            this.selectedOptions.deselectAll();
            s.option.selected = true;
            this.method = s.option.value;
        });
    }

    apply() {
        let data: SampleDialogData = new SampleDialogData(this.method, this.numSamples, this.ratio);
        switch (this.method) {
            case "first":
                data.ratio = 1.0;
                break;
            case "ratio":
                data.limit = 0;
                data.ratio = this.ratio / 100;
                break;
            default:
                break;
        }
        this.dialog.close(data);
    }

    /**
     * Hides this dialog.
     */
    hide() {
        this.dialog.close(null);
    }
}