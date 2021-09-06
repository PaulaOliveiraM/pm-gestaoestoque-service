import { Router } from 'express';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';


export interface IComponentRoutes<T> {
	readonly name: string;
	readonly controller: T;
	readonly router: Router;

	initRoutes(): void;
	initChildRoutes?(): void;
}

export enum DomainErrorCode{
    EntregaNaoLocalizada = "EntregaNaoLocalizada",
	EntregaJaBaixada = "EntregaJaBaixada",
	ProdutoNaoInformado = "ProdutoNaoInformado"
}

export class DomainError {
	public Code : DomainErrorCode;
	public Message : string;

	constructor(code: DomainErrorCode, message: string){
		this.Code = code;
		this.Message = message;
	}
}


export abstract class AbsRepository<T> {
	protected readonly name: string;
	protected readonly repo: Repository<T>;
	protected readonly defaultRelations: string[];

	constructor(name: string, repo: Repository<T>, defaultRelations: string[] = []) {
		this.name = name;
		this.repo = repo;
		this.defaultRelations = defaultRelations;
	}

	
	
	readAll(options: FindManyOptions<T> = {}): Promise<T[]> {
		try {
			if (Object.keys(options).length) {
				return this.repo.find({
					relations: this.defaultRelations,
					...options
				});
			}

			return this.repo.find({
				relations: this.defaultRelations
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	read(options: FindOneOptions<T>): Promise<T | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	
	async save(entity: T): Promise<T> {
		try {
			const saved: T = await this.repo.save(entity);

			return saved;
		} catch (err) {
			throw new Error(err);
		}
	}

	async delete(entity: T): Promise<T> {
		try {
			const deleted = await this.repo.remove(entity);

			return deleted;
		} catch (err) {
			throw new Error(err);
		}
	}
}
