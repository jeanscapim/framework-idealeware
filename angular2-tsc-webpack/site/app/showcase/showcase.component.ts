import {Component, AfterViewChecked, OnInit, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import {ShowCase} from '../_models/showcase/showcase';
import {Group} from '../_models/group/group';
import {Product} from '../_models/product/product';
import {Title} from '@angular/platform-browser';
import {ShowCaseService} from '../_services/showcase.service';
import {GroupService} from '../_services/group.service';
import { ProductService } from '../_services/product.service';
import { AppSettings } from "../app.settings";

//declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'showcase',
    templateUrl: '/views/showcase.component.html'
})
export class ShowCaseComponent {
	banners: Object[] = [];
	groups: Group[] = [];
	showcase: ShowCase = new ShowCase();

    constructor (
		private titleService: Title,
		private service: ShowCaseService,
		private groupService: GroupService,
		private productService: ProductService,
	){ }

	ngOnInit(){
		this.service.getShowCase()
			.then(showcase => {
				this.showcase = showcase;
				AppSettings.setTitle(this.showcase.metaTagTitle, this.titleService);
				return showcase.groups;
			})
			.then(groups => {
				this.showcase.groups.forEach(group => {
					this.productService.getProductsFromShowcaseGroup(group.id)
					.then(products => {
						group.products = products;
					})
					.catch(error => console.log(error));
				});
			})
			.catch(error => console.log(error));
	}

	ngOnDestroy() {
		this.showcase = null;		
	}

	ngAfterViewChecked() {}

	isMobile(): boolean{
		return AppSettings.isMobile();
	}
		
}