import {Plugin, WorkspaceLeaf, setIcon} from 'obsidian';

export default class FileTabIconsPlugin extends Plugin {
	async onload() {
		const updateAll = () => {
			this.updateAllLeafIcons();
		};
		this.registerEvent(this.app.workspace.on('editor-change', updateAll));
		this.registerEvent(this.app.workspace.on('active-leaf-change', updateAll));
		this.registerEvent(this.app.workspace.on('layout-change', updateAll));
		this.registerEvent(this.app.workspace.on('file-open', updateAll));
		this.registerEvent(this.app.workspace.on('window-open', updateAll));
	}

	updateAllLeafIcons() {
		this.app.workspace.iterateAllLeaves(leaf => {
			this.updateLeafIcon(leaf);
		});
	}

	updateLeafIcon(leaf: WorkspaceLeaf) {
		// @ts-expect-error undocumented
		const historyState = leaf.getHistoryState()?.state;
		if (!historyState || historyState.type !== 'markdown') {
			return;
		}

		const path = historyState.state.file;
		const file = this.app.vault.getMarkdownFiles().find(file => file.path === path);
		if (!file) return;

		const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
		// console.log(frontmatter);
		if (!frontmatter || !frontmatter.icon) return;

		this.setLeafTabIcon(leaf, frontmatter.icon);
	}

	setLeafTabIcon(leaf: WorkspaceLeaf, icon: string) {
		// @ts-expect-error undocumented
		setIcon(leaf.tabHeaderInnerIconEl as HTMLElement, icon);
	}
}
